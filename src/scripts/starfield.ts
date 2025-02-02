export class StarField {
  private readonly canvas: HTMLCanvasElement
  private readonly context: CanvasRenderingContext2D | null
  private stars: Array<{
    x: number
    y: number
    originalX: number
    originalY: number
    alpha: number
    speed: number
  }> = []
  private readonly mousePosition = { x: -1000, y: -1000 }
  private readonly SPACING = 18
  private readonly starRadius = 1
  private readonly influenceRadius = 80
  private canvasWidth: number
  private canvasHeight: number
  private starColor = '255, 255, 255'
  private rotationX = 0
  private rotationY = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = this.canvas?.getContext('2d') ?? null
    this.canvasWidth = this.getCanvasWidth()
    this.canvasHeight = this.getCanvasHeight()

    if (this.context !== null) {
      this.initStars()
      this.resizeCanvas()
      this.drawStars()
      this.addEventListeners()
      this.observeThemeChanges()
      this.addGyroListener() // Add the gyroscope listener
    } else {
      console.error('El contexto 2D no se pudo obtener.')
    }

    window.addEventListener('resize', this.onResize.bind(this), false)
  }

  private getCanvasWidth(): number {
    return this.canvas.clientWidth
  }

  private getCanvasHeight(): number {
    return this.canvas.clientHeight
  }

  private resizeCanvas(): void {
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
  }

  private initStars(): void {
    this.stars = []
    for (let x = -5; x < this.canvasWidth; x += this.SPACING) {
      for (let y = -5; y < this.canvasHeight; y += this.SPACING) {
        this.stars.push({
          x,
          y,
          originalX: x,
          originalY: y,
          alpha: Math.random(),
          speed: Math.random() * 0.005 + 0.002
        })
      }
    }
  }

  private drawStars(): void {
    if (this.context !== null) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    }

    this.stars.forEach((star) => {
      const dx = this.mousePosition.x - star.x
      const dy = this.mousePosition.y - star.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.influenceRadius) {
        const angle = Math.atan2(dy, dx)
        const force = (this.influenceRadius - distance) / this.influenceRadius
        star.x = star.originalX - Math.cos(angle) * force * 20
        star.y = star.originalY - Math.sin(angle) * force * 20
      } else {
        star.x += (star.originalX - star.x) * 0.05
        star.y += (star.originalY - star.y) * 0.05
      }

      star.alpha += star.speed
      if (star.alpha > 1 || star.alpha < 0) {
        star.speed = -star.speed
      }

      if (this.context !== null) {
        this.context.fillStyle = `rgba(${this.starColor}, ${Math.abs(star.alpha)})`
        this.context.beginPath()
        this.context.arc(star.x, star.y, this.starRadius, 0, Math.PI * 2)
        this.context.fill()
      }
    })

    // Apply the rotation effect based on gyro data
    this.applyGyroRotation()

    requestAnimationFrame(this.drawStars.bind(this))
  }

  private addEventListeners(): void {
    this.canvas.parentElement?.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    )
    this.canvas.parentElement?.addEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    )
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    this.mousePosition.x = event.clientX - rect.left
    this.mousePosition.y = event.clientY - rect.top
  }

  private onMouseLeave(): void {
    this.mousePosition.x = -1000
    this.mousePosition.y = -1000
  }

  private onResize(): void {
    this.canvasWidth = this.getCanvasWidth()
    this.canvasHeight = this.getCanvasHeight()
    this.resizeCanvas()
    this.initStars()
  }

  private observeThemeChanges(): void {
    const htmlElement = document.documentElement
    this.updateStarColor()
    const observer = new MutationObserver(() => {
      this.updateStarColor()
    })
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }

  private updateStarColor(): void {
    const htmlElement = document.documentElement
    if (htmlElement.classList.contains('dark')) {
      this.starColor = '0, 0, 0'
    } else {
      this.starColor = '255, 255, 255'
    }
  }

  private addGyroListener(): void {
    window.addEventListener(
      'deviceorientation',
      (event: DeviceOrientationEvent) => {
        this.rotationX = event.gamma || 0 // Rotation around the X-axis
        this.rotationY = event.beta || 0 // Rotation around the Y-axis
      }
    )
  }

  private applyGyroRotation(): void {
    if (this.context !== null) {
      this.context.save() // Save the current canvas state

      // Apply rotation transformations based on gyro data
      this.context.translate(this.canvasWidth / 2, this.canvasHeight / 2)
      this.context.rotate(((this.rotationX + this.rotationY) * Math.PI) / 180)

      this.context.restore() // Restore the canvas state
    }
  }
}
