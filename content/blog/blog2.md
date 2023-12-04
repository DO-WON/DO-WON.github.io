---
title: "Integrating Zotero and Obsidian for Academics" 
date: 2023-12-01
url: /blog2/
tags: ["productivity","zettlekasten"]
author: "Do Won Kim"
description: "Tutorial for INST800 at UMD iSchool"
summary: "Tutorial for INST800 at UMD iSchool: Integrating Zotero and Obsidian for Academics" 
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

Academic work entails the tasks of gathering, reading, and annotating resources, writing manuscripts, and citing references. 

Synthesizing the wealth of information you've gathered, making connections, and expanding on scattered ideas can be challenging. 

This tutorial will walk you through the process of integrating Obsidian and Zotero, allowing you to create a personalized knowledge management flow (=*Zettelkasten*)!

---

## Zotero and Obsidian? 

**`Zotero`** is a free, open-source reference management software. 
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
(A short demo in class; a short video will be uploaded later!)   

**On Zotero:** 
1. Collect references (e.g. drag and drop PDF file, web browser extension)
2. Read PDFs (e.g. leave notes, highlight, capture figures, etc.)

→ You want to link and synthesize the annotated notes. 

**On Obsidian:**
1. Load literature note from Zotero  
2. Skim through the loaded note and reorganize it
3. Link your note as you write! 

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
        - citation key formula: `authors(n=1,etal=EtAl)+year`
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
   
   3) `Settings` >> `Open Better BibTeX preferences` >> `Automatic export`
   - Set path where `My Library` file is in!
   ![](/zotero_4.png)
   
   </details>


#### Obsidian community plugin settings 
- **Zotero Integration**
  <details> <summary> Click </summary> 
    
    - Click `Add citation format` and add different formats as below
    ![](/obsidian_9.png)
  </details>


- **Pandoc References List** 
  <details> <summary> Click </summary> 
     
    - Fallback path to pandoc: click 🔍 and [install](https://pandoc.org/installing.html) if needed. 

    - Path to bibliography file: folder where you stored `My Library` file exported from Zotero
  ![](/obsidian_10.png)
    
  </details>
  

 - **Citations**
     <details> <summary> Click </summary> 
    
      - Citation database format: BibLaTeX (or other if you choose different one)
      - Citation database path: the same folder (`My Library` file)
      - Literature note folder: `50 Literature Notes/`
      ![](/obsidian_11.png)
      - Literature note template: Put content of your template (e.g. [templates.md](/templates.md))
      ![](/obsidian_12.png)
      </details>
 
   
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
