---
title: "How to Create a Stackoverflow Terminal Client - Go"
date: 2020-02-09T19:55:53Z
draft: true
cover: "img/logo.png"
---

Around a month ago I came across a project [howdoi](https://github.com/gleitz/howdoi) created in python. And honestly it was amazing, finding solution of basic problems without opening browser was a life saver, so I thought of creating one for myself. As one of my major goal was speed ,so I went with Go lang.

So today, let me show you how to use Stackoverflow using just a terminal.

---
# Create Go Environment

I won't go in details about how to install Go or how the directory structure should look. You can find everything on the official page and the docs.

[Official Installation Docs](https://golang.org/doc/install)

---
# What All We Need to Create
- A scraper to get the posts using search query 
- A scraper to get the contents for each question
- A UI to display the solution
---

# Get Result for Search Query

A general Stackover flow search url looks somthing like
```https://stackoverflow.com/search?q=how+to+add+2+numbers```

This makes it easy for us to get the result as what we need to change everytime is just the part after *search?q=*

After getting the content of page our next job is to get content from correct elements to get *Title*, *Description*,  *Link to Post*  and *Up Votes*.
For that first we need to create a *Struct* to store these data.

```Go
type post struct {
	title       string
	link        string
	upvotes     string
	description string
}
```
for getting content of page we will be using *GoQuery* Library

So the code snippet for getting the data from search is 
```Go
res, err := goquery.NewDocument(fmt.Sprintf("https://stackoverflow.com/search?q=%s", strings.ReplaceAll(query, " ", "+")))
	if err != nil {
		log.Fatal(err)
    }
```
The question is stored in div with class `question-summary` So we will iterate on each element with this class and get required details from the div.

Class for 
- post link is `.result-link`
- question description is `.excerpt`
- upvotes count is `.vote-count-post`
- title is same as link tag, all we need is to get the text for a tag 

After getting all content we will store the data in list of posts struct
  
The final source code for getting the data will look something like
```Go
func searchPost(query string) []post {
	res, err := goquery.NewDocument(fmt.Sprintf("https://stackoverflow.com/search?q=%s", strings.ReplaceAll(query, " ", "+")))
	if err != nil {
		log.Fatal(err)
	}

	var items []post
	res.Find(".question-summary").Each(func(index int, item *goquery.Selection) {
		linkTag := item.Find(".result-link").Find("a")
		link, _ := linkTag.Attr("href")
		title := strings.TrimFunc(linkTag.Text(), func(r rune) bool {
			return !unicode.IsLetter(r) && !unicode.IsNumber(r)
		})
		description := item.Find(".excerpt").Text()
		upvotes := item.Find(".vote-count-post").Text()
		//fmt.Println(link)
		if true || (strings.HasPrefix(title, "Q:") && index < 4) {
			items = append(items, post{title, link, upvotes, description})
			index++
		}
	})
	return items
```
After this we are done with getting the content of search page and storing in our array.
Next part will be getting content for each question and storing it in another array 

# Get Each Post Content

We have url for each post stored in the array from previous section, our next job is to go on each of these links and get content for that page and store it in another array.

So the stackoverflow page for answer has 2 parts , A question section and a list of solutions. We will get each solution and store it in another array and return the answers along with the accepted answer
This will be same as previous part.
Struct we will be using for this part will be

```Go
type solution struct {
	description string
	upvotes     string
}
```
So the class for question is `.question` and for accepted answer it is `accepted-answer`

After this remaining answers will be scraped using the relative div from *accepted answer div*

code for getting the question content is

```Go

	var answers []solution
	question := res.Find(".question").Find(".post-layout")
	answers = append(answers, solution{strings.Trim(question.Find(".post-text").Text(), "\n"), question.Find(".js-vote-count").Text()})

```
code for getting the accepted answer is
``` Go

	acceptedContainer := res.Find(".accepted-answer").Find(".post-layout")
	acceptedAnswer := solution{strings.Trim(acceptedContainer.Find(".post-text").Text(), "\n"), acceptedContainer.Find(".js-vote-count").Text()}

```
and finally for getting remaining answers
```Go
if (acceptedAnswer != solution{}) {
		res.Find(".accepted-answer").NextAll().Each(func(index int, item *goquery.Selection) {

			if item.Find(".post-text").Text() != "" {
				answers = append(answers, solution{strings.Trim(item.Find(".post-text").Text(), "\n"), item.Find(".js-vote-count").Text()})
			}
		})
	} else {
		res.Find(".post-layout").Each(func(index int, item *goquery.Selection) {

			if item.Find(".post-text").Text() != "" {
				answers = append(answers, solution{strings.Trim(item.Find(".post-text").Text(), "\n"), item.Find(".js-vote-count").Text()})
			}
		})
    }
```
So after combining everything we will get

```GO
func getPost(node post) (solution, []solution) {
	urlString := fmt.Sprintf("https://stackoverflow.com/%s", node.link)
	res, err := goquery.NewDocument(urlString)
	if err != nil {
		log.Fatal(err)
	}
	var answers []solution
	question := res.Find(".question").Find(".post-layout")
	answers = append(answers, solution{strings.Trim(question.Find(".post-text").Text(), "\n"), question.Find(".js-vote-count").Text()})

	acceptedContainer := res.Find(".accepted-answer").Find(".post-layout")
	acceptedAnswer := solution{strings.Trim(acceptedContainer.Find(".post-text").Text(), "\n"), acceptedContainer.Find(".js-vote-count").Text()}

	if (acceptedAnswer != solution{}) {
		res.Find(".accepted-answer").NextAll().Each(func(index int, item *goquery.Selection) {

			if item.Find(".post-text").Text() != "" {
				answers = append(answers, solution{strings.Trim(item.Find(".post-text").Text(), "\n"), item.Find(".js-vote-count").Text()})
			}
		})
	} else {
		res.Find(".post-layout").Each(func(index int, item *goquery.Selection) {

			if item.Find(".post-text").Text() != "" {
				answers = append(answers, solution{strings.Trim(item.Find(".post-text").Text(), "\n"), item.Find(".js-vote-count").Text()})
			}
		})
	}

	return acceptedAnswer, answers
}
```
# Build the UI

So we have Everything we need, Question list from search page and then solution for each post , Now we need to display the content in a UI.
what we will be trying to obtain is 2 parts, one for question and other one for the question description. Something like this.
![ui1](ui1.png)


![ui2](solution.png)

So the library we will be using is [termui](https://github.com/gizak/termui).
Our UI will have 3 sections , one for question list, other for question description and the last for the possible solution and we will display 2 sections at a time
Now I won't cover the whole library as we only need some parts of it.

So for creating a box with paragraph inside we have a widget already provided in the library, but the problem with it is we can't scroll it , so for that we will create our own paragraph widget.

The source code for the widget is

For struct
```Go
type Paragraph struct {
	Block
	Text      string
	TextStyle Style
	WrapText  bool
	start     int
	end       int
}
```
and the remaining code base

```Go

func NewParagraph() *Paragraph {
	return &Paragraph{
		Block:     *NewBlock(),
		TextStyle: Theme.Paragraph.Text,
		WrapText:  true,
	}
}

func (self *Paragraph) Draw(buf *Buffer) {
	self.Block.Draw(buf)

	cells := ParseStyles(self.Text, self.TextStyle)
	if self.WrapText {
		cells = WrapCells(cells, uint(self.Inner.Dx()))
	}

	rows := SplitCells(cells, '\n')
	if self.end-self.start <= len(rows) {
		if self.end > len(rows) {
			self.end = len(rows)
			self.start = self.end - 40
		}

		if self.start <= 0 {
			self.start = 0
			self.end = 40
		}
		rows = rows[self.start:self.end]
	}
	for y, row := range rows {
		if y+self.Inner.Min.Y >= self.Inner.Max.Y {
			break
		}
		row = TrimCells(row, self.Inner.Dx())
		for _, cx := range BuildCellWithXArray(row) {
			x, cell := cx.X, cx.Cell

			buf.SetCell(cell, image.Pt(x, y).Add(self.Inner.Min))
		}
	}
}
```
Now explaining the whole code will be an another article, but to give you people a gist, it basically takes the style we specified and create cells, then it takes the whole text and breaks it into lines and then iterating on each line , drawing it into the cell we specified above, and placing it at the correct position.

The part which is important is 
``` Go
	if self.end-self.start <= len(rows) {
		if self.end > len(rows) {
			self.end = len(rows)
			self.start = self.end - 40
		}

		if self.start <= 0 {
			self.start = 0
			self.end = 40
		}
		rows = rows[self.start:self.end]
    }
```
This part handles the content scrolling, what this is doing is we provide 2 values one is start and other one is end. Then it uses those values to slice the array, so that we  draw only a part of the whole content on screen.This start and end value will change on each key press so the content will look like its scrolling.

So the rest of the part is pretty straight forward, we will be using this newly created widget and create 3 boxes with different content.
I won't display the code of this part here as it will make the post unnecessarily long, instead I will explain the flow.
So we will first create 3 paragraphs

Example code :

```Go
	quesBox := NewParagraph()

	quesBox.Title = "Question Description"
	quesBox.SetRect(width/2, 4, width, height-4)
	quesBox.start = 0
	quesBox.end = 44
	quesBox.WrapText = true
    quesBox.BorderStyle.Fg = ui.ColorYellow
```
And then the only task would be to render correct box on correct key press.
So termui provides few functions like *Render* to render particular element and a whole keyboard binding to refer each key.
Example code:

```Go
uiEvents := ui.PollEvents()
	for {
		e := <-uiEvents
		switch e.ID {
		case "q", "<C-c>":
            return
```

So this handles the closing of Ui if someone presses *q* or *ctrl-c*, we can add other cases to render correct Box on key press.

So the final thing will work something like
![working](working.gif)

You can find the whole source code at:-
[https://github.com/pr4k/howto](https://github.com/pr4k/howto)

