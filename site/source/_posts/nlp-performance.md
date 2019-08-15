---
title: Performance of Different NLP Toolkits in Formal and Social Text
date: 2017-08-27 15:11:36
tags:
- nlp
- natural-language-processing
- research
- benchmark
---

## Motivation for this work 

The Web is a large source of data, mostly expressed in natural language text. Natural language processing (NLP) systems need to understand the human languages in order to extract new knowledge and perform diverse tasks, such as information retrieval, machine translation, or text classification, among others.
For widely-spoken languages, such as English, there is currently a wide range of NLP toolkits available for performing lower-level NLP tasks, including tokenization, part-of-speech (POS) tagging, chunking or named entity recognition (NER).

This enables that more complex applications do not have to be developed completely from scratch. Yet, with the availability of many such toolkits, the one to use is rarely obvious.
Users have also to select the most suitable set of tools that meets their specific purpose. Among other aspects, the selection may consider the community of users, frequency of new versions and updates, support, portability, cost of integration, programming language, the number of covered tasks, and, of course, their performance.
Most NLP tools available for English are made with good ease-of-use in mind, are open-source and are freely available, but it is not always clear which tool best fits the requirements of the user.

This post compares a range of natural language processing toolkits with their default configuration, while performing a set of standard tasks (e.g. tokenization, POS tagging, chunking and NER), in popular datasets that cover newspaper and social network text. This kind of comparison is helpful for other developers and researchers in need of making a similar selection.

## Addressed Tasks

In order to evaluate how good standard NLP tools perform against different kinds of text, such as noisy text from social networks and formal text from newspapers, the performance of common NLP tasks was analysed. The addressed tasks were tokenization, POS-tagging, chunking and NER. The following list describes the four evaluated tasks:

* **Tokenization:** usually the first step in NLP pipelines. It is the process of breaking down sentences into tokens, which can be words or punctuation marks. Although it seems a relatively easy task, it has some issues because some words may rise doubts on how they should be tokenized, namely words with apostrophes, or with mixed symbols.

* **Part-of-Speech (POS) Tagging:** given a specific tagset, it determines the part-of-speech of each token in a sentence. In this work, the tags of the [Penn Treebank](https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html) Project, popular among the NLP community, were used. 

* **Chunking:** also known as shallow parsing, it is a lighter syntactic parsing task. The main purpose is to identify the constituent groups in which the words are organized. This includes at least noun phrases (NP), verb phrases (VP) and prepositional phrases (PP). The sequence of chunks forms the entire sentence. They may also be nested inside each other to form a tree structure, where each leaf is a word, the previous node is the corresponding POS-tag and the head of the tree is the chunk type.

* **Name Entity Recognition/Classification:** deals with the identification of certain types of entities in a text and may go further classifying them into one of given categories, typically PERson, LOCations, ORGanizations, all proper nouns, and sometimes others, such as dates. Usually this task is also useful to link mentions in the text to a specific entity. This usually involves other sub-problems such as Name Entity Disambiguation (NED). 

## Compared Tools

Tools can be implemented in different programming languages; have available models that cover different tasks, kinds of text or languages; require different setups; or have different learning curves for simple usage or for integration. The tools compared in this work were trained for English and are open, well-known and widely used by the NLP community.
Moreover, they were developed either in Java or Python, which, nowadays, are probably the two languages more frequently used to develop NLP applications and for which there is a broader range of available toolkits.
The compared tools are enumerated in the following list, where they are described and grouped in ``standard'' toolkits, which means they were developed with no specific kind of text in mind, and social network-oriented tools, which aim to be used in short messages from social networks.

### Standard NLP toolkits

* The [**NLTK toolkit**](http://www.nltk.org) is a Python library aimed at individuals who are entering the NLP field.  It is divided in independent modules, responsible for specific NLP tasks such as tokenization, stemming, tree representations, tagging, parsing and visualization. It also comes bundled with popular corpus samples ready to be read. By default, NLTK uses the Penn Treebank Tokenizer, which uses regular expressions to tokenize the text. Its PoS tagger uses the Penn Treebank tagset and is trained on the PENN Treebank corpus with a Maximum Entropy model. The Chunker and the NER modules are trained on the ACE corpus with a Maximum Entropy model.

* [**Apache OpenNLP**](https://opennlp.apache.org) is a Java library that uses machine learning methods for common natural language tasks, such as tokenization, POS tagging, NER, chunking and parsing.
Users can either rely on pre-trained models for the previous tasks or train their own with a Perceptron or a Maximum Entropy.
The pre-trained models for English PoS tagging and chunking use the Penn Treebank tagset. The Chunker is trained on the CoNLL-2000 dataset. The pre-trained NER models provided cover the recognition of persons, locations, organizations, time, date and percentage expressions.

* The [**Stanford CoreNLP**](http://stanfordnlp.github.io/CoreNLP) toolkit is a Java pipeline that provides common language processing tasks. The most supported language is English, but other languages are also available. Comparing to other frameworks such as GATE or UIMA, CoreNLP is simple to set up and run, since users do not need to learn and understand complex installations and procedures. The CoreNLP performs a Penn Treebank style tokenization and the POS module is an implementation of the Maximum Entropy model using the Penn Treebank tagset. The NER component uses a Conditional Random Field (CRF) model and is trained on the CoNLL-2003 dataset. 

* [**Pattern**](https://github.com/clips/pattern) is a Python library that provides modules for web mining, NLP and ML tasks. This library does not provide methods for a single field but rather a general cross-domain and ease-of-use functionality. The PoS tagger uses a simple rule-based model trained on the Brown Corpus.

### Social Network-Oriented Toolkits

* [**Alan Ritter's TwitterNLP**](https://github.com/aritter/twitter_nlp) is a Python library that offers a NLP pipeline for performing Tokenization, POS, Chunking and NER. The authors reduced the problem of dealing with noisy texts by developing a system based on a set of features extracted from Twitter-specific POS taggers, a dedicated shallow parsing
logic, and the use of gazetteers generated from entities in the Freebase knowledge base, that best match the fleeting nature of informal texts.

* [**CMU's TweetNLP**](http://www.cs.cmu.edu/~ark/TweetNLP) is Java tool that provides a Tokenizer and a POS Tagger with available models, trained with a CRF model in Twitter data, manually annotated by its authors.
In addition to the typical syntactic elements of a sentence, TweetNLP identifies content such as mentions, URLs, and  emoticons.

* [**TwitIE**](https://gate.ac.uk/wiki/twitie.html) is an open-source plugin for GATE. The GATE framework comes already packaged with ANNIE, an information extraction system, and includes resources such as: a Tokenizer, a sentence splitter, gazetteer lists, a PoS tagger and a semantic tagger. TwitIE re-uses some of these components (sentence splitter and gazeteer lists) but adapts the other to the Twitter kind of text, supporting language identification, Tokenization, normalization, PoS tagging and Name Entity Recognition. The TwitIE tokenizer follows the same tokenization scheme as TwitterNLP. The PoS tagger uses an adptation of the Stanford tagger, trained on tweets with the Penn Tree Bank tagset, with additional tags for retweets, URLs, hashtags and user mentions.

## Datasets 

In order to evaluate the performance of the different NLP toolkits and determine the best performing ones, the same criteria must be followed, including the same metrics and manually-annotated gold standard data.
Testing tools in the same tasks and scenarios makes comparison fair and more reliable. This work used well-known datasets widely used in NLP and text classification research, not only in the evaluation of NLP tools, but also for training new models. More precisely, different gold standard datasets that cover different kinds of text -- newspaper and social media.
Regarding newspaper text, a collection of news wire articles from the [Reuters Corpus](http://trec.nist.gov/data/reuters/reuters.html) was used. The POS and chunking annotations of this dataset were obtained using a memory-based MBT tagger. The named entities were manually annotated at the University of Antwerp.

In order to represent social and more informal text, the annotated data from [Alan Ritter's Twitter corpus](https://github.com/aritter/twitter_nlp/tree/master/data/annotated) was used, with manually tokenized, POS-tagged and chunked Twitter posts, also with annotated named entities. The collection of Twitter posts used in the [MSM 2013 workshop](http://oak.dcs.shef.ac.uk/msm2013/challenge.html), where named entities are annotated, was also used as a gold standard for social media text.

The POS tags of the CoNLL-2003 dataset follow the [Penn Treebank style](https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html). Alan Ritter's corpus follows the same format, with the same POS-tags and additional specific tags for retweets, @usernames, \#hashtags, and urls. For the chunk tags, the format I\O\B-TYPE is used in both datasets. This is interpreted as: the token is inside (I), in the beginning (B) of a following chunk of the same type or outside (O) of a chunk phrase.
The named entities in the CoNLL-2003 dataset are annotated using four entity types, namely Location (LOC), Miscellaneous (MISC), Organization (ORG) and Person (PER). In Alan Ritter's corpus, entity types were not exactly the same, so they had to be converted, as we mention further on this section. The \#MSM2013 corpus only contains annotated named entities and their types. To ease experimentation, this corpus was converted to the same format as the other two.

## Evaluation

The performance of a NLP tool in a certain task can be estimated by the quality of its predictions on the classification of unseen data. Predictions made are either considered Positive or Negative (under some category) and expected judgments are called True or False (again, under a certain category). The following are common metrics used to assess classification:

* **Precision:**  - The proportion of correctly classified instances (True Positives) among all the classified instances under a certain category (True Positives and False Positives).

* **Recall:** - The proportion of correctly classified instances (True Positives) under a certain category (True Positives and False Negatives).

* **F-measure:** - Combines precision and recall, and is computed as the harmonic mean between the two metrics.

The previous metrics provide insights on the behavior of the tool. We can go further and compute the previous estimations in different ways such as:

* **Micro Averaging:** - The entire text is treated as a single document and the individual correct classifications are summed up.

* **Macro Averaging:** - The precision and recall metrics are computed for each document and then averaged.

## Results and discussion

On the CoNLL dataset, which uses formal language, standard toolkits perform well. OpenNLP excels with F1=99% in tokenization, 88% in POS-tagging and 83% in chunking.  In the NER task, NLTK~(89%) and OpenNLP~(88%) performed closely. TwitterNLP also performed well in this dataset. This is not that surprising if we add that the CoNLL-2003 dataset was one of the corpora TwitterNLP was trained on, and it is probably also tuned for this corpus.

As expected, the performance of standard toolkits, developed with formal text in mind, decreases when used in the social network corpora. This difference is between 5-8% for tokenization, 17% for POS-tagging, 17-40% for chunking, or 5-18% for NER. This is not the case of Pattern, which performs poorly in the CoNLL corpus but improves significantly when tokenizing, PoS tagging and chunking the Twitter corpora. Although not developed specifically for Twitter, OpeNLP and CoreNLP still obtain interesting results for tokenization and NER in its corpus (F1 > 80%).

Also as expected, in the Twitter corpus, the Twitter-oriented toolkits performed better than the others. TweetNLP was the best in the tokenization (97%) and POS-tagging (95%) tasks. TwitterNLP performed closely (96% and 92%). In the case of TwitIE, the difference of performance in different types of text was not relevant. Once again, it should be highlighted that TwitterNLP was trained with the Twitter corpus, so this comparison is not completely fair. 

Using only the available pre-trained models, there is not one toolkit that overperformed all the others in every scenario. Though, some are more balanced than the others. Even if it cannot be seen as a strong conclusion, the results suggest that OpenNLP is the best choice for news text, and TwitterNLP for social media text.
Although the latter result was biased on the TWitter corpus, where TwitterNLP was trained on, we also tested it on another corpus, where it got the best results.
It should be noticed that we ended up using datasets that were more appropriate for specific tasks. For instance, although its text of the CoNLL-2003 dataset is tokenized, POS-tagged, and chunked, it was specifically developed for a NER shared task. On the other hand, we did not use the CoNLL-2000, developed for a chunking shared task.

As expected, standard toolkits perform better in formal texts, while Twitter-oriented tools got better results in social media text.  These results might be useful for potential users willing to select the most appropriate tools for their specific purposes, especially if they do not have time or expertise to train new models.

More details about this experiment, including the detailed results, can be found in the [full text version](http://drops.dagstuhl.de/opus/volltexte/2016/6008/pdf/OASIcs-SLATE-2016-3.pdf).