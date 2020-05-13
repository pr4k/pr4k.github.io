---
title: "Sudoku Solver"
date: 2020-05-13T17:22:28Z
draft: false

---

## Project Motivation

Okay so one day browsing through Reddit , I came across a project,
It was a sudoku solver using video cam stream. The project was cool, 
but there was only 1 thing I didn't liked, it used to crop the sudoku image 
and give a solved sudoku image solution.

So I thought why not project back the solution to the original image to make it 
look like its solved in the original image

---
## About Project 

So well the project is simple, take the sudoku image, solve it
and project back the solution to the image, thats all !!.
Well that was my initial plans, but execution is another thing.

Brief project technology description is:

- Get the sudoku block in the image - **Python OPEN CV**
- Crop the sudoku image and change perspective - **Python OPEN CV**
- Extract the digits in some ordered manner - **Python KNN Model**
- Solve the sudoku - **Using Rust Sudoku Solver**
- Project back the solution into the original image - **Python OPEN CV**

Well we can solve the sudoku using *Python* but for some reason I wanted to try 
adding Rust to python, also its faster than python in solving the sudoku.

If you find it interesting , Lets start!!


---
## Crop & Change Perspective

After this Section we will be converting the full image to cropped image.
Initial Image:

{{< image src="orgnl.jpg" alt="Hello Friend" position="center" style="border-radius: 8px; width: 400px; padding: 20px;" >}}


Okay so basic logic is
1. Get the biggest box in image as it will be most probably the sudoku box.
2. Next is to draw lines along the sudoku box edges.
3. Find the intersection points of these images.
4. Use the intersection points to change the perspective of image and get
the cropped sudoku.

Okay so lets see each step one by one!

### Getting the biggest box:
``` python
original = img.copy()
#img = cv2.medianBlur(img,5)
img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
greymain = cv2.cvtColor(img,cv2.COLOR_RGB2GRAY)

th2 = cv2.adaptiveThreshold(greymain,255,cv2.ADAPTIVE_THRESH_MEAN_C,\
            cv2.THRESH_BINARY_INV,39,10)


contours,heirarchy = cv2.findContours(th2,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
maxarea = 0
cnt = contours[0]
for i in contours:
    if cv2.contourArea(i)>maxarea:
        cnt = i
        maxarea = cv2.contourArea(i)

```
Lets understand the code!
First of all contour is basically any closed shape , we will be using opencv library to first,
- Converting image to **GRAY**
- Using adaptiveThreshold to convert the image to either black or pure white.
- Opencv has a function `findContours` it returns the contours(***closed shape***)
- Going through Each contour and getting the max area contour.

After this we will be having the biggest contour which most probably is the sudoku box.

As this just gives the outline of the shape, we can't use it to get the sudoku box, we need the four corner points to change perspective.

Hence we will be first drawing this contour on a blank image and the draw straight lines on this shape, it will give us four lines which will be later used
to get the four corner points.

``` python
    blank = np.zeros(img.shape,np.uint8)
    image = cv2.drawContours(blank,[cnt],-1,(255,255,255),2)
    edges = cv2.Canny(image,40,150,apertureSize = 3)
    lines = cv2.HoughLines(edges,1,np.pi/180,100)
    createhor = []
    createver = []
    created = []
    anglediff=10
    rhodiff=10
    flag=0
    count = 2
```
After this we will have lines along the sudoku sides but the thing is , 
there are multiple lines along a single side, because the `Houghlines` uses
roughly in line points to draw a line and as our image is not very clear nor is 
the correct perspective hence what we get is multiple lines along a single side.

So what we will be doing is we will eliminate all lines which are close to each other, 
but leave one hence we will be left with 4 lines for 4 sides.
```python
    
    for line in lines:
        for (rho,theta) in line:
            flag=0
            for (rho1,theta1) in created:
                if abs(rho-rho1)<rhodiff and abs(theta-theta1)<anglediff:
                    flag=1
                    
            if flag==0:
                a = np.cos(theta)
                b = np.sin(theta)
                x0 = a*rho
                y0 = b*rho
                x1 = int(x0 + 1000*(-b))
                y1 = int(y0 + 1000*(a))
                x2 = int(x0 - 1000*(-b))
                y2 = int(y0 - 1000*(a))
                d = np.linalg.norm(np.array((x1,y1,0))-np.array((x2,y2,0)))
                cv2.line(img,(x1,y1),(x2,y2),(0,255,0),2)
                m=abs(1/np.tan(theta))
                if m<1:
                    createhor.append((rho,theta))
                else:
                    createver.append((rho,theta))
                created.append((rho,theta))
                
    points=[]
```
So now we have 4 lines, what's left is to get the intersection points of these
lines.

Well as our lines are not parallel hence we will be getting 6 point of intersection. 
we will be using the slope, we will divide the lines into 2 category, horizontal and vertical. And this way we will get only 4 points.
**Note**: The lines are not the horizontal and vertical but are just 2 categories.

```python
    for (rho,theta) in createhor:
        for (rho1,theta1) in createver:
            if (rho,theta)!=(rho1,theta1):
                a=[[np.cos(theta),np.sin(theta)],[np.cos(theta1),np.sin(theta1)]]
                b=[rho,rho1]
                cor=np.linalg.solve(a,b)
                if list(cor) not in points:
                    points.append(list(cor))
    
```
Now we have 4 corner points , its time to do the magic and get the sudoku image.

```python
points.sort()
    if (points[0][1]>points[1][1]):
        points[0],points[1]=points[1],points[0]
    if (points[-1][1]<points[-2][1]):
        points[-1],points[-2]=points[-2],points[-1]
    
    points[1],points[2]=points[2],points[1]
    for i in points:
        images = cv2.circle(image,(int(i[0]),int(i[1])),4,(0,0,255),-1)
    pts1 = np.float32(points)
    pts2 = np.float32([[0,0],[size,0],[0,size],[size,size]])
    M = cv2.getPerspectiveTransform(pts1,pts2)
    
    warped2 = cv2.warpPerspective(blank,M,(size,size))
    img = cv2.warpPerspective(original,M,(size,size))
```
Nothing fancy, we will be using the `warpPerspective` to change the perspective and get the image.

Final output:

{{< image src="crpzimg.jpg" alt="Hello Friend" position="center" style="border-radius: 8px; width: 400px;padding: 20px;" >}}

---
## Extract Digits from Sudoku Image
This section will be focused on extracting the digits from sudoku image.

So first is some eroding and dilating to remove the noise .
Next is to get the contour of digits, and drawing the on a new blank image.
After that its just drawing the divider lines.

After this we will get
{{< image src="sd_img.jpg" alt="Hello Friend" position="center" style="border-radius: 8px; width: 400px;padding: 20px;" >}}
A clean sudoku image with no noise.

Next is simple, just iterating through each box and predicting the numbers.
First approach which failed very very miserably was to use a **CNN** model and training it to predict the numbers.
After some experimenting I went ahead with **KNN** Model.

The first problem was to create the dataset, Tried kaggle but apparently there
are no dataset for simple plained numbers.
So I created a script which first writes the digits on an image, adds some **Noise and blur** to make it realistic and then crop it.

Then I used another good Library `Augmentor` , It uses the present images and adds random tilts, rotations etc. Hence what I got was 10k images for each number.
Pretty cool!! Atleast for me, I was not able to sleep after doing that master piece stuff .
Okay after we are done of thinking about it lets move to train the model.

```python
import numpy as np
import os
import scipy.ndimage
from skimage.feature import hog
from skimage import data, color, exposure
from sklearn.model_selection import  train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.externals import joblib
import cv2

features_list = []
features_label = []
# load labeled training / test data
# loop over the 10 directories where each directory stores the images of a digit
for digit in range(0,10):
    label = digit
    training_directory = 'output/' + str(label) + '/'
    for filename in os.listdir(training_directory):
        if (filename.endswith('.jpg')):
            training_digit = cv2.imread(training_directory + filename)
            df= hog(training_digit, orientations=8, pixels_per_cell=(4,4), cells_per_block=(7, 7))
            training_digit = color.rgb2gray(training_digit)

            # extra digit's Histogram of Gradients (HOG). Divide the image into 5x5 blocks and where block in 10x10
            # pixels
       
            features_list.append(df)
            features_label.append(label)

# store features array into a numpy array
features  = np.array(features_list, 'float64')
# split the labled dataset into training / test sets
X_train, X_test, y_train, y_test = train_test_split(features, features_label)
# train using K-NN
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
# get the model accuracy
model_score = knn.score(X_test, y_test)

# save trained model
joblib.dump(knn, 'models/knn_model.pkl')

```
Next was easy, just use this model to predict the numbers and creating a new image of a sudoku.

After everything what we have is
{{< image src="unsolved_sd_img.jpg" alt="Hello Friend" position="center" style="border-radius: 8px; width: 400px;padding: 20px;" >}}

---

## Solve Sudoku 
We will be solving sudoku using Rust in this section.

After our last section we have numbers in sudoku image, whats left is to code a sudoku solver, in rust and thankfully we can export it into a library which can be
imported in python.

```rust
use cpython::{py_fn, py_module_initializer, PyResult, Python};
use sudoku::Sudoku;

py_module_initializer!(sudoku_solver, |py, m| {
    m.add(py, "__doc__", "This module is implemented in Rust.")?;
    m.add(py, "solve", py_fn!(py, solve_py(sudoku_line: String)))?;
    Ok(())
});

fn solve_py(_: Python, sudoku_line: String) -> PyResult<String> {
    let out = solve(sudoku_line);
    Ok(out)
}
fn solve(sudoku_line: String) -> String {
    let sudoku = Sudoku::from_str_line(&sudoku_line).unwrap();

    let mut solution: String;
    solution = "".to_string();
    // Solve, print or convert the sudoku to another format
    if let Some(solve) = sudoku.solve_unique() {
        // print the solution in line format
        solution = solve.to_string();

        // or return it as a byte array
    }
    solution.to_string()
}
```
Well there is a library sudoku which provides a good sudoku solver, 
so I used it to create a function and wrote Python bindings to import in python,
another master piece moment lol.

After this solving the sudoku and creating a solution mask was left.

And the final solution looked like.
{{< image src="solved_sd_img.jpg" alt="Hello Friend" position="center" style="border-radius: 8px; width: 400px;padding: 20px;" >}}
Great !! Lets move to the nect part

---
## Project the Solution To Original Image
Final section, it will be focusing on projecting the solution to the original image.

Once we have solution mapped on a black image , just doing a bitwise not
and and was enough to remove the black part of image, and as we had the initial points, changing back the perspective, is also easy
```python
M = cv2.getPerspectiveTransform(pts2,pts1)
    
    img = cv2.warpPerspective(sudoku_image,M,(original.shape[1],original.shape[0]))
    img = cv2.bitwise_not(img)
    img = cv2.bitwise_and(img,original)
```

Thats all!! The final image is
{{< image src="final.jpg" alt="Hello Friend" position="center" style="border-radius: 8px; width: 400px;padding: 20px;" >}}

---

## Source Code

You can find all the source code at.
[github.com/pr4k/sudoku-solver](https://github.com/pr4k/sudoku-solver)

