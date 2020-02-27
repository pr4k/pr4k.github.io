---
title: "How to Create an Effective Readme"
date: 2020-02-19T23:22:15Z
cover: "img/readme.jpg"
draft: true
---


*Photo by Helloquence on Unsplash*


> As Harvey says, *First Impression Lasts*.

Lets be honest even before trying any project on github the first thing we do is check their Readme. A better readme not only make your project look better and professional but also a well framed readme makes it easy for others to test and use your project.
There are many projects out there which are not on trending just because *there are not enough instructions* to fire that up.
So today I will share some of things which can make your readme atleast a bit less nooby.

## Use Href to create a Navigation bar

Yes you heard it right, Adding a navigation bar in the readme not only look darn cool but also serves a good purpose if your readme is long.

As finally your readme is converted to an HTML page, hence you can always create a Nav Bar type thing

A simple Nav Bar code will look something like this.

```html
<p align="center">
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#features">Features</a> •
    <a href="#to-do">To-Do</a> •
    <a href="#license">License</a>
</p>
```
Just put all your headings as Href Source and voila!!

## Use p tag to align items to center

How many times have you tried to center an image . Yes Github flavoured markdown doesn't have any way to center the readme (Maybe I was not able to find it). So a work around is to introduce some html to center the stuff.

 ```html
<p align="center">
    <img src="logo.png" width="490" alt"howto" >
    <br>
    <img src="https://goreportcard.com/badge/github.com/pr4k/howto"
        alt="GoReport">
    <img src="https://travis-ci.com/pr4k/howto.svg?branch=master" alt="Build">
    <img src="https://img.shields.io/github/stars/pr4k/howto" alt="Stars">
    <img src="https://img.shields.io/github/issues/pr4k/howto" alt="Issues">
    <img src="https://img.shields.io/github/forks/pr4k/howto" alt="Forks">
</p>
```
This Not only makes your image to center but also you can handle the image size too which is a plus


## Use Badges 
Well this thing alone takes your Readme from noobie to some what professional. Using appropriate Badges makes your readme more descriptive and also provides the basic info like build status.

Adding a badge is very easy
Just go to [shields.io](https://shields.io/)
Enter your github repo link and it will automatically provide you with the Suggested badges.

Example:


![Build](https://travis-ci.com/pr4k/howto.svg?branch=master)


## Use word clouds for quick image with titles
So uptil now our readme has a nav bar , a good badges set but now comes the part of adding some cool images. But finding images which match your project is really time consuming, and creating one yourself is just another story. So what you can do is , go to word cloud to create a decent image which can server as a logo and also looks elegant.
Creating a word cloud is supper easy.

- Go to [word cloud](https://www.wordclouds.com/)
- Enter your word list and select a figure , and Done.

Sample:

![answerme](https://camo.githubusercontent.com/0cb4e9c8c941194572ada6f7ac9cc80be9c2baeb/68747470733a2f2f692e696d6775722e636f6d2f473752537943682e6a7067)

Inspired by [answerme](https://github.com/sumandipanshu/answerme)



## Use Images and Gifs to make it more attractive - Asciinema

Final one and major one, as every other thing in your project are just text except the logo, and honestly we all know that nobody reads that much unless they are really interested. So adding some gifs and images makes your project eye catchy and If you can add a gif about how this project works, It makes it even better.
A very good tool which can be used is [Asciinema](https://asciinema.org/).

- Create an account on asciinema
- Download their client
- Now If you creating a screen grab for your terminal can easy be done by asciinema.

Follow there official guide for exact steps [Guide](https://asciinema.org/docs/installation)

Sample:
[![asciicast](https://asciinema.org/a/Fh5xrpejzh2miP88NZtLED5gm.svg)](https://asciinema.org/a/Fh5xrpejzh2miP88NZtLED5gm)

---
That's All, now you have a good readme , Time to create a project for it ;)

To have a look at every thing above mentioned in action, checkout the readme - [howto](https://github.com/pr4k/howto)

