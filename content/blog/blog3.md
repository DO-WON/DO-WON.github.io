---
title: "Making a GitHub Website for Academics" 
date: 2024-03-20
url: /blog3/
tags: ["productivity","website"]
author: "Do Won Kim"
description: "Making a GitHub Website for Academics"
summary: "Step-by-step tutorial on how I made my github website!" 
image: "/obsidian_zotero.png"
cover:
    image: "/github_frontpage.png"
    alt: "Building a GitHub webste"
    relative: false
editPost:
    URL: ""
    Text: ""
showToc: true
disableAnchoredHeadings: false
---

# How to build an academic website

This is a step-by-step tutorial of how to build an academic website hosted on GitHub pages (or step-by-step 
demonstrations of how I did it). 

## Step 0. Prerequisties 
1. You must have a GitHub account.
2. Download [GitHub Desktop](https://desktop.github.com/) in your local machine (laptop or desktop). 
3. You must have a template, or specifically, a template repository in mind. I used [this](https://github.com/pmichaillat/hugo-website?tab=readme-ov-file) as my template. All credits to amazing [Pascal Michaillat](https://pascalmichaillat.org/)!

Now, let's start building your website!

## Step 2. Fork the template 
First step is to fork the template repository. 

How to fork? 
- Go to the template repository
- Click `Use this template` button (the green one!) on the top right 
- Then, click `Create a new repository`

Now, you will see the following page:
![](/forking.png)

- In the `Repository name` section, you must put in `<your GitHub owner name>.github.io`. For example, in my case, it's `DO-WON.github.io`. 
- Then, click the green `Create repository` button below. 


## Step 2. Clone the forked repository to the local machine 
It is good to work from your local machine and then commit and push changes to your GitHub repository. 

- Go to the forked repository
- Click the green button on the top right `<> Code`
- You will see `Local` as follows:
![](/forking2.png)
- Click `Open with GitHub Desktop`
- Choose local path (on your laptop/desktop)
- Click the `Clone` button in the bottom right

## Step 3. Install Hugo
Install [Hugo](https://gohugo.io/installation/). If you use Mac, you can install Hugo by running the following code in your terminal:
```shell
brew install hugo
```

## Step 4. Setting up config.yml

Next step is to make changes in your local machine. The first thing you need to change is the `config.yml` file. 

- Open the repository on your local IDE (e.g., VS Code, PyCharm, etc.)
  - You can open it using GitHub Desktop (please refer to this [link](https://collectionbuilder.github.io/cb-docs/docs/repository/open/#use-github-desktop-to-open-your-repository))
- On your IDE, open `config.yml` file 
- Change the `baseURL`. For me, I put `do-won.github.io` as the `baseURL`. You should put your own GitHub username instead of `do-won`. 

## Step 5. Update your website! 

Since you have made some changes on your local machine, now it's time to update your website. 

### Development stage
While you develop (make changes, testing those changes, make further changes ... ), you could check how the changes you made look like on your local environment. In the terminal of your IDE (whereever you are working on), try running the following code: 
```shell
hugo server
```
![](/localhost.png)
Then, click the `http://localhost:1313/` to check how your website looks like. This is very useful since it takes some time to compile, render, and deploy all the changes on GitHub. In the development stage, use Hugo to automatically reflect changes made locally and rebuild the website.  

If you want to stop running hugo server, enter `contorl+C` on your terminal.

### Compiling and deploying 
After you checked how the changes made look like with Hugo server, and finished making all the changes you needed, you are now ready to deploy those changes on your website.   

First, run `hugo` in your IDE terminal of your repository. 
```shell
hugo
```
This command compiles everything that needed to deploy the changes to your website. 

Then, using your IDE or GitHub Desktop, commit and push changes to your online repository. 

Wait till the deployment is completed and visit your website! 

## Next steps
Now you know how things work, you can make further changes in your local machine and deploy them.

Please refer to [this page](https://pascalmichaillat.org/d5/) for further customization! 

