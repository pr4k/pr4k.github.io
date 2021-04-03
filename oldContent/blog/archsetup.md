---
title: "My Arch Setup"
date: 2020-03-03T02:17:32Z
draft: false 
cover: img/archsetup.png
---
My first experience with linux was with ubuntu and it was great but the only problem was the
extra packages which were making it heavy.

One day I was going through reddit where I came across a reddit channel called UnixPorn, and
watching other people's setup inspired me to get one of my own.

So here is My arch setup and steps to get one for yourself too.

# Installation Guide

To be honest , the best Installation guide for Arch is their [official guide](https://wiki.archlinux.org/index.php/Installation_guide)
Still I will give some steps in short to tell you about the basic flow
- Download the [ISO](https://www.archlinux.org/download/)
- Boot Arch from USB
- Set Keyboard layout and verify BOOT Mode
- Connect to internet
- Partition the disk
- Format and Mount the partitions

After completing these steps, next is Installing the Arch from their mirrors

- Install Essential Packages

`pacstrap /mnt base linux linux-firmware`

this will install your kernel which is linux in our case and other firmware for common hardware

- Configure The System

`genfstab -U /mnt >> /mnt/etc/fstab`

- Change Root
`arch-chroot /mnt `

- Set Time Zone
- Localization
- Network Configuration
- Set Root Password
- Finally install Boot Loader

Done Now reboot and you will have your Arch installed.
Honestly I had to repeat the whole installation process 3-4 times because in first 2-3 times
I always landed into Boot Recovery.But still after installation its just a ugly looking terminal, converting it to something like 
![setup1](newsetup1.png)
is our aim.

Well the major work is done. Whats left is first installing a Display server.

I installed Xorg [Official Installation Guide](https://wiki.archlinux.org/index.php/Xorg)
After installing a display server next job is to get a display manager and configure it.
Now this article is not for installing Arch but is for Ricing it.
So once you are done with Arch installation lets move towards adding the required applications.

## Packages

### NeoVim

First and foremost we need a text editor, lets go with Neovim
[Officical Guide](https://github.com/neovim/neovim/wiki/Installing-Neovim)

After Installing the NeoVim Lets beautify it.

[dot file]()
#### What all will it include

- NerdTree for file browser
- fuzzy search
- airline
- Customization

How it looks now:
![NeoVim](neovim.png)

### Ranger

[Official Guide](https://wiki.archlinux.org/index.php/Ranger#Installation)

This is required because we need a file browser and ranger looks darn cool
[dot file]()

How it looks now:

![ranger](ranger.png)

### ZSH

[Official Guide](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH)

This is way better than bash and it supports features like auto completion etc.

### PolyBar

[Official Guide](https://github.com/polybar/polybar#getting-started)

[dot file]()


### Pywal

This is the best thing, and most important thing. It creates a color combination based on our wallpapers.

[Official Guide](https://github.com/dylanaraps/pywal/wiki/Installation)

# Final Motivation

## Setup 1

![setup 1](newsetup1.png)

![setup 2](newsetup2.png)

![setup 3](newsetup3.png)

## Setup 2

![setup 4](newsetupcar1.png)

![setup 5](newsetupcar2.png)

## Setup 3

![setup 6](oldsetup1.png)

![setup 7](oldsetup2.png)

















































