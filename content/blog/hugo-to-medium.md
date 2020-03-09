---
title: "Hugo to Medium"
date: 2020-03-09T02:12:45Z
draft: false 
cover: img/hugo-to-medium.jpg
---
###### *Photo by Yancy Min on Unsplash*
## Motivation 

So everytime I added a blog on my personal website (Which is very rare) I had to go to my medium profile and import it manually. So once I got to know about Github actions, the first idea was to automate this process. Also this project was an attempt to understand Github Actions better.

## Description

So what our action does is everytime I push my code to the github Repo with a special commit message, it takes the new post and use the Medium API and creates a new draft at my medium account.

Okay so lets get into it.

## Development

So first of all let me clear some things out, As this was my first GitHub Action, I had no idea about how this all integrates. It took me time before it all started making sense, so what I will suggest is, if someone is creating it for the first time you can create 2 repository one for your action and second for testing that action.

The [Official Setup guide](https://help.github.com/en/actions/building-actions/creating-a-docker-container-action) is good but still it was a bit confusing for me as the Docker container example is very simple and covers just a Hello World type example.

Before we start, please read how to setup the environment variables in Github, and also generate your APP_ID , APP_SECRET, and ACCESS_TOKEN from [Medium applications](https://medium.com/me/applications) and [Medium setting](https://medium.com/me/settings)

### Create Action.yml

So first lets see the code 

```yaml
# action.yml
name: 'Hugo to Medium'
description: 'Pushes your blog from hugo to medium' 
runs:
  using: 'docker'
  image: 'Dockerfile'
branding:
  icon: 'aperture'
  color: 'gray-dark'
Okay so its pretty simple 
```
`name`: The name of our action

`description`: The normal description of our action

`runs`: This is where it starts, Basically it uses our DockerFile and spawns it.

`branding`: This is just a normal branding which will be used at the market place

## Create DockerFile

```Docker
FROM python:3.7.2-alpine3.9
RUN apk add --no-cache \
    jq \
    curl \
    git \
    python
RUN apk add --no-cache python3-dev libstdc++ && \
    apk add --no-cache g++ && \
    ln -s /usr/include/locale.h /usr/include/xlocale.h && \
    pip3 install medium 
ADD entrypoint.sh /
ADD post.py /
RUN chmod +x /post.py
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```


Okay so our docker file will be using a python alpine image 
then it will install the required Modules.
Then we will be installing Medium library which will be later used to provide an interface between medium and our project.

Then it will Copy our  `entrypoint.sh` and `post.py` and then finally the Entrypoint defines the script which will run first.

## Create entrypoint.sh

```bash
#!/bin/sh -l

main(){
    message=$(jq  '.commits[0].message' "$GITHUB_EVENT_PATH")
    python /post.py $message
}
main
```

Okay so this is simple, basically it finds our latest github commit message and send it to our `post.py` script.
We can easily do it by using python as later we will be needing python, but for some reason I wanted to use bash to traverse a json file and to be honest, it was good, so if anyone wants to read the docuentation for it. [Here it is](https://stedolan.github.io/jq/tutorial/)

The `$GITHUB_EVENT_PATH` stores path for the json file which stores the information about out repo like commits, owners etc.

## Create post.py

So lets see the code for posting it to Medium.
We will be using Environment variables mentioned at the start. The `BLOG_DIR` is the directory where your blogs are posted. 

For example `content\blog`

```python
import os
import sys

from medium import Client

ENV = os.environ
def postToMedium(heading,body):
    client = Client(application_id = ENV["APP_ID"],application_secret = ENV["APP_SECRET"])

    client.access_token = ENV["ACCESS_TOKEN"]

    user = client.get_current_user()

    post = client.create_post(user_id = user["id"], title = heading, content = body, content_format = "markdown", publish_status = "draft")

    print("New!! post at ",post["url"])

commit_msg = " ".join(sys.argv[1:])
blog_path = os.path.join(ENV["GITHUB_WORKSPACE"],ENV["BLOG_DIR"])
blog_dir = os.listdir(blog_path)
if "PUBLISH" in commit_msg.upper():
    post_name = commit_msg.upper().split("PUBLISH")[1].strip()[:-1]
    for i in blog_dir:
        if post_name == i.upper().strip():
            post_path = os.path.join(blog_path,i)
            body = open(post_path,"r").read()
            postToMedium(i,body)
```

Okay so the code is simple it takes all the Environment variables and also take the commit message which is passed from `entrypoint.sh` .

It checks whether the commit message contains `PUBLISH` if yes then we go on matching it from all the files in the blog directory. Once it finds the blog name given in commit message it takes the file and send it to our function which will handle the medium part.

The medium part is simple , its taken from the medium's official documentation. So its pretty self explanatory,
It takes APP_ID and APP_SECRET from environment variables to create our client, then it takes ACCESS_TOKEN from the environment, next we get the user details and use the user id to create the post , 

The title for our post is file name right now .
we are sending the code in Markdown format as our hugo blog is in markdown.
And done that's it our post is uploaded to the medium profile.

But wait a minute!! what about those join splits strips .
Okay so everything I said above is the how the things should go, honestly at one point my Github action log was showing something like ,

`Post.MD == Post.MD => False` , after 30 mins of testing and modification I got to know that the length of both the string is different because there were empty spaces , So that's why we need to strip them, 

Other then that join is just to convert the list of string to a string and split is to get the content after the tage in our commit message PUBLISH.

## Sample main.yml
Lets see a sample `main.yml` for setting it up in our personal projects.
```yaml
on: [push]

jobs:
  hugo_to_medium_job:
    runs-on: ubuntu-latest
    name: hugo-to-medium
    steps:
      - uses: actions/checkout@v2
        with:
          ref: master
      - name: Hugo To medium Action step 
        uses: pr4k/Hugo-to-Medium@master # Uses an action in the root directory
        id: hello
        env:
          APP_ID: ${{secrets.APP_ID}}
          ACCESS_TOKEN: ${{secrets.ACCESS_TOKEN}}
          APP_SECRET: ${{secrets.APP_SECRET}}
          BLOG_DIR: ${{secrets.BLOG_DIR}}
```
We are using Checkout Action because we will be requiring our Repo content in the Docker file, then I am calling my Action from Master branch.

Paste this into `.github/workflows/` and done

You can find the full source code at [@pr4k/Hugo-To-Medium](https://github.com/pr4k/hugo-to-medium)
Thanks For reading.
