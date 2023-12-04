---
title: "Integrating Zotero and Obsidian for Zettelkasten" 
date: 2023-12-01
url: /blog2/
tags: ["productivity","zettlekasten"]
author: "Do Won Kim"
description: "Tutorial for INST800 at UMD iSchool"
summary: "Integrating Zotero and Obsidian" 
image: "/obsidian_zotero.png"
cover:
    image: "/obsidian_zotero.png"
    alt: "Integrating Zotero and Obsidian"
    relative: false
editPost:
    URL: ""
    Text: ""
showToc: true
disableAnchoredHeadings: false
---
## What does this tutorial cover?
Have you ever delved into extensive reading and meticulous note-taking, only to later realize that important details slipped your mind or got misplaced? Have you found yourself captivated by the gathering of valuable resources but faced challenges in effectively incorporating them into a cohesive narrative?

Academic work entails the exciting tasks of gathering, reading, and annotating resources, writing well-thought-out manuscripts, and meticulously citing references. There's also the challenge of synthesizing the wealth of information you've gathered, making connections, and expanding on scattered ideas. This tutorial will walk you through the process of integrating Obsidian and Zotero, allowing you to create a personalized knowledge management flow (=*Zettelkasten*)!

---

## Zotero and Obsidian? 

**`Zotero`** is a free, open-source reference management software designed to help researchers collect, organize, cite, and share their bibliographic references. 
Below are the features that I found most useful:
- Zotero allows users to automatically retrieve **metadata** of references 
- Zotero has web **browser extension**, enabling users to save references directly from websites.
- Zotero allows users to highlight and annotate **PDFs** directly within the application.

**`Obsidian`** is a popular note-taking and knowledge management tool that allows users to create and link notes while also formatting content using the markdown system.
Below are the features that I found most useful: 
- Obsidian emphasizes **bidirectional linking**, meaning that if you link one note to another, the linked note automatically links back to the original. This helps in creating a web of interconnected thoughts and ideas.
- Obsidian provides a **graph view** that visually represents the connections between different notes, allowing users to see the relationships in their knowledge base.


---

## Workflow

**On Zotero:** 
1. Collect references (e.g. drag and drop PDF file)
2. Read PDFs (e.g. leave notes, highlight, capture figures, etc.)

→ You want to link this annotated notes to obsidian where you keep things that you read, think, and so on 

**On Obsidian:**
1. Press hot key to load note from Zotero 
   - Zotero should run in the background to connect 
2. Skim through the loaded note and reorganize it
3. Link your note as you write! 
   + Use plug-ins such as Dataview to manage literature review  
   + Use graph view to visualize the knowledge map


---

## How can we build this work flow? 

### Step 1. Set up Zotero
1. [Download](https://www.zotero.org/download/) Zotero and Chrome Connector


2. [Install](https://retorque.re/zotero-better-bibtex/installation/) Better BibTeX plugin for Zotero 
    <details>
    <summary>Click</summary>
    It looks like this on Zotero...
   
    ![](/zotero_bibtex.png)
    
    - If you click the button `Open Better BibTeX preferences...`
          
    ![](/zotero_bibtex2.png)
        
    </details>


### Step 2. Set up Obsidian 

1. [Download](https://obsidian.md/) Obsidian 

2. Create a new vault 
    <details> <summary> Click </summary>

    1) Set your vault name and path
    ![](/obsidian_1.png)
     
    2) Click `Create` and now you're in! 
    ![](/obsidian_2.png)
    </details>

3. Create folders 
   - We need (1) a separate folder for storing **literature notes** loaded from Zotero, and 
   (2) another separate folder to store all the **meta information** such as images and templates.
   - e.g. Folder structure
     - `50 Literature Notes` 
     - `80 Meta`
       - `81 Attachments`
       - `82 Templates`
   - Create a template file in the folder `82 Templates`
      - [Download](/templates.md)

4. Install community plug-ins
   <details> <summary> Click </summary>

   1) Click `settings` (gear icon in the bottom left) 
   2) `Community plugins` >> `Turn on community plugins`
      ![](/obsidian_3.png)
   3) `Browse` 
   ![](/obsidian_4.png)
   4) Search for `Zotero Integration` and click `Install`
   ![](/obsidian_5.png)
   5) In this way, install the following community plugins: 
   `Pandoc Plugin`,`Pandoc Reference List`,`Citations`, `Dataview`, and `Admonition`
   <br></br>
   6) Enable installed plugins
   ![](/obsidian_6.png)
   7) Now, scroll down in the left panel (community plugins) and click `Zotero Integration` ! 
   </details>

5. Set up `Zotero Integration` 
   <details> <summary> Click </summary>

   1) Note import loaction: `50 Literature Notes/`
   2) Import Formats: Click `Add Import Format` and put in information
      - Name: `Create Literature Note`
      - Output path: `50 Literature Notes/@{{citekey}}.md`
      - Image output path: `80 Meta/81 Attachments/{{citekey}}/`
      - Template file: put your template file here 
      - Bibliography style: pick one 
   ![](/obsidian_7.png)
   
   </details>

6. Set up hotkeys for loading notes from Zotero
      <details> <summary> Click </summary>
   
      - Press `Hotkeys` in the left panel >> Set hotkeys for `Create Literature Note`
 
      ![](/obsidian_8.png)
   
      </details>



### Step 3. Additional settings

#### Zotero 

1. Export `My Library`
   <details> <summary> Click </summary>

   1) Right-click on `My Library` folder and click `Export Library`
   2) You will see the following screen: 
   ![](/zotero_1.png)
      - Must click `Export Notes` and `Keep updated` >> `OK` >> Select path  
   </details>

2. Better BibTeX settings
   <details> <summary> Click </summary>

   1) `Settings` >> `Cite` : You will see the following screen:
      ![](/zotero_2.png)
   2) Click `Style Editor` >> choose your CSL(=citation style language) and click `save as`  
   ![](/zotero_3.png)
   
   </details>


#### Obsidian 

Community plugin settings: 

- **Pandoc References List** 
  - Path to bibliography file: folder where you stored `My Library` file exported from Zotero 
- **Citations** 
  - Citation database format: BibLaTeX (or other if you choose different one)
  - Citation database path: the same folder (`My Library` file) 
  - Literature note folder: `50 Literature Notes/` for me 
  - Literature note templates (put relevant info from your literature note)

   
Now we are all set! 👍

### Step 4. Synthesize knowledge (=write!!!) on Obsidian


#### Useful to have: header! 
```markdown
---
category: paper
tags:
  - 
status: writing
---
```
#### To cite
- `[[@citekey]]`: Link to the literature note
- `[@citekey]`: Inline citation  


### Step 5. Export the Draft

To export the draft, you need the following information:
- Path to the file that you want to export (#1)
- Path to the csl file (#2)
- Path where you want to store exported file (#3) 
- Title and format of your exported file (e.g. `Title.docx`)

In terminal, you should put the following (in a single line) and enter! 
```markdown
pandoc "#1" --bibliography "#2" --citeproc --csl "#3" -o "#3/Title.docx"
```



---
## Note
- A short video will be uploaded here (after the class) for revisiting! 
<br></br>

#### Dataview  

  ```dataview  
   TABLE  
   title as Title,  
   FirstAuthor as "First Author",  
   Year as Year,  
   itemType as Item,  
   Citekey as Citekey,  
   Contribution as Contribution  
   FROM "50 Literature Notes"  
   ```




---
## References
- Linking Zotero and Obsidian: 
  - [An Updated Academic Workflow: Zotero & Obsidian](https://medium.com/@alexandraphelan/an-updated-academic-workflow-zotero-obsidian-cffef080addd)
  - [Literature Reviews using Zotero & Obsidian](https://medium.com/@alexandraphelan/literature-reviews-using-zotero-obsidian-66eba1565d78)
- Obsidian: [How To Create A New Vault In Obsidian](https://www.alphr.com/obsidian-how-to-create-a-new-vault/)
