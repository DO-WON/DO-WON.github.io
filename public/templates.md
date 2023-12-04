---
category: literaturenote  
tags: {% if allTags %}{{allTags}}{% endif %}  
citekey: {{citekey}}  
status: unread  
dateread:  
---

> [!Cite]
> {{bibliography}}
  
>[!Synth]  
>**Contribution**::  
>
>**Related**:: {% for relation in relations | selectattr("citekey") %} [[@{{relation.citekey}}]]{% if not loop.last %}, {% endif%} {% endfor %}

  
>[!md]
{% for type, creators in creators | groupby("creatorType") -%}  
{%- for creator in creators -%}  
**{{"First" if loop.first}}{{type | capitalize}}**::
{%- if creator.name %} {{creator.name}}  
{%- else %} {{creator.lastName}}, {{creator.firstName}}  
{%- endif %}  
{% endfor %}~  
{%- endfor %}  
> **Title**:: {{title}}
> **Year**:: {{date | format("YYYY")}}
> **Citekey**:: {{citekey}} {%- if itemType %}
> **itemType**:: {{itemType}}{%- endif %}{%- if itemType == "journalArticle" %} 
> **Journal**::*{{publicationTitle}}* {%- endif %}{%- if volume %}
> **Volume**:: {{volume}} {%- endif %}{%- if issue %}  
> **Issue**:: {{issue}} {%- endif %}{%- if itemType == "bookSection" %}
> **Book**:: {{publicationTitle}} {%- endif %}{%- if publisher %}  
> **Publisher**:: {{publisher}} {%- endif %}{%- if place %}
> **Location**:: {{place}} {%- endif %}{%- if pages %}
> **Pages**:: {{pages}} {%- endif %}{%- if DOI %}
> **DOI**:: {{DOI}} {%- endif %}{%- if ISBN %}
> **ISBN**:: {{ISBN}} {%- endif %}
  
> [!LINK]
> {%- for attachment in attachments | filterby("path", "endswith", ".pdf") %}
> [{{attachment.title}}](file://{{attachment.path | replace(" ", "%20")}}) {%- endfor -%}.

  
> [!Abstract]  
> {%- if abstractNote %}  
> {{abstractNote}}  
> {%- endif -%}.
> 



{%- set important = annotations | filterby("comment", "startswith", "important") -%}  
{%- if important.length > 0 %}

> [!important] Callouts  
{%- for annotation in important -%}  
{%- if annotation.annotatedText %}  
> - {{annotation.annotatedText | nl2br}}  
{%- endif -%}  
{%- if annotation.imageRelativePath %}  
> - ![[{{annotation.imageRelativePath}}]]  
{%- endif %}  
> [page {{annotation.page}}](file://{{annotation.attachment.path | replace(" ", "%20")}})  
{%- endfor -%}  
{%- endif %}  
{%- if annotations.length %}



## Annotations  
{%- endif %}

{%- macro calloutHeader(type, color) -%}  
{%- if type == "highlight" -%}  
<mark style="background-color: {{color}}">Highlight</mark>  
{%- endif -%}

{%- if type == "text" -%}  
Note  
{%- endif -%}  
{%- endmacro -%}

{%- set annots = annotations | filterby("date", "dateafter", lastExportDate) -%}  
{%- if annots.length > 0 %}  
### Exported: {{exportDate | format("YYYY-MM-DD h:mm a")}}

{% for annot in annots -%}  
> {{calloutHeader(annot.type, annot.color)}}  
{%- if annot.annotatedText %}  
> {{annot.annotatedText | nl2br}}  
{%- endif -%}  
{%- if annot.imageRelativePath %}  
> ![[{{annot.imageRelativePath}}]]  
{%- endif %}  
> [page {{annot.page}}](file://{{annot.attachment.path | replace(" ", "%20")}}) [[{{annot.date | format("YYYY-MM-DD#h:mm a")}}]]  
{%- if annot.comment %}  
> - {{annot.comment | nl2br}}  
{% endif %}

{% endfor -%}  
{% endif -%}

