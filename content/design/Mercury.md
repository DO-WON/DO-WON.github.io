---
title: "A field experiment to mitigate the harm of inaccurate health information online"
description: "Mercury Project"
tags: ["Field Experiment", "Social Media"]
summary: "Muting low-quality sources vs. Receiving media literacy tips" 
showToc: true
disableAnchoredHeadings: false
---


# Project Overview
This study is funded by the Social Science Research Council under the [Mercury Project](https://www.ssrc.org/grantees/a-field-experiment-to-mitigate-the-harm-of-online-misinformation/)


# Research Questions and Hypotheses
**Hypothesis 1:** Assignment to the muting treatment (H1a) and the media literacy treatment (H1b) will reduce total engagement with low-quality news sources during the treatment period. The effect of the muting treatment will be larger (H1c). 

**Hypothesis 2:** Assignment to the media literacy treatment will improve sharing and accuracy discernment between true and false information in wave 2 (post-treatment) and in wave 3.

**Research question 1:** Will assignment to the muting treatment affect sharing and accuracy discernment between true and false information in wave 3? 

**Research question 2:** Will assignment to the muting treatment affect total engagement with low-quality news sources excluded from the treatment (i.e., those that are not muted) during the treatment period?

**Hypothesis 3:** Assignment to the muting treatment will increase total engagement with high-quality sources during the treatment period.

**Research question 3:** Will assignment to the muting or media literacy treatments change trust in low-quality accounts (RQ3a) or how much respondents value those accounts (RQ3b)?

**Research question 4:** Will assignment to the muting or media literacy treatments change total engagement with low- or high-quality news sources after the treatment period? How will the muting effect vary depending on whether the accounts are unmuted for participants or left muted by default?

# Study Design (Pilot Study)
We conducted a multi-arm, multi-wave RCT on Twitter/X (treatment period: 1 month). 

![](/pilot_study_flow.png)


## Wave 1. Screening Survey
We screened out those who 
(1) don’t use X frequently, 
(2) failed to pass the attention check, 
(3) didn't consent or failed to authorize our X developer app,
(4) didn't follow our study account (needed for sending DMs), and
(5) didn't fully complete Wave 1 survey. 

Based on participants who passed these screening criteria, we ran eligibility checks. 

To be eligible for Wave 2 invitation, participants' X accounts should not be created too recently (at least created 2 mo prior to the study).  
Also, participants should be **following** at least one of the low-quality sources from our list (inventory of low-quality sources from third-party checkers such as NewsGuard), 
or they should be **exposed** to at least one low-quality sources in their home timelines. 

## Wave 2. Midline Survey
We invited eligible participants who are likely to have low-quality information diets on X (following OR exposed). 

### Elicit WTA (Willingness to Accept)
- Purpose (to measure the demand of social media in $ amount)

“The computer has randomly generated an amount of money to offer you to mute the accounts (please note: it may be nothing). 
Before we tell you what the offer is, we will ask you the dollar amount that an offer would have to exceed for you to mute these accounts. 

If the offer the computer generated is above the amount you give, we will mute the accounts for four weeks and pay you the offer amount as long as you keep these accounts muted. Note that if you agree to mute these accounts and unmute them before the four week period is over, you will not be eligible for future bonus payments or invited to participate in future studies. 
If the offer is equal to or below that amount, we will not mute the accounts and you will not receive an additional payment.
(...)

Please consider your answer carefully and then indicate the dollar amount that an offer would have to exceed for you to mute these accounts for four weeks. If the offer you receive exceeds the amount you enter, it means you would accept the offer and agree to mute the accounts.”

### Randomization
- 33% - Muting ($15 fixed amount)
  - “The payment you are offered is $15. This is above the payment you requested. The accounts have been muted and you will receive the payment in one month as long as they stay muted.”

- 1% - Muting ($0~30 random amount, if WTA < random amount)
  - This is to make it incentive compatible 
  - “The payment you are offered is ${random amount}. This is above the payment you requested. The accounts have been muted and you will receive the payment in one month as long as they stay muted.”

- 33% - Media Literacy
  - “The payment you are offered is below the amount you requested, no account have been muted. Now we would like to present some information that will help you to better evaluate the headlines you see on social media. Please read the information below carefully; we will ask you questions about them later.”
  
- 33% - Control 
  - “The payment you are offered is below the amount you requested. You do not need to mute any accounts.”

#### **Intervention 1. Muting**
Once participants are randomized to the muting condition, we did the muting on behalf of participants. 

Easy to check and keep the compliance (100%!!!!)


#### **Intervention 2. Media Literacy** 
We used media literacy tips from Guess et al. PNAS (2020). 

![](/media_literacy.jpg)


## Wave 3. Endline Survey

After one-month treatment period for each participant, we invited them to Wave 3 survey to measure post-treatment outcomes. 

Also, we elicited WTA again and randomized once more, to check the effect of temporarily muting accounts on behavior. 
We offered participants options to keep muting (for muting group) or mute low-quality sources (for media literacy and control groups). 

The purpose of this desing is to check whether unmuting effect exactly the opposite to muting, or 
whether people/algorithms change their behavior after some accounts have been muted for a while. 

### Randomization
- 49% - no offer
  - For muting group, we let them opt to unmute if wanted. 
- 49% - $0 offer 
  - For muting group, we unmute muted low-quality accounts. 
  - For media literacy and control groups, there is no muting. 
- 2% - $0~30 random offer
  - If WTA < random offer: 
    - For muting group, we keep muted low-quality accounts as muted for further 1 month.
    - For media literacy and control groups, we newly mute low-quality accounts for 1 month. 
  - If WTA >= random offer: same with $0 offer case. 

Hence, after the wave 3, we had post-endline 1-month treatment period as well. 


## Flow of Pilot Study
To summarize, 
![](/full_survey_flow.png)
