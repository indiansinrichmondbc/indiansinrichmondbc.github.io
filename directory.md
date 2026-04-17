---
layout: default
title: Richmond Indian Community Directory
description: Find Indian businesses, restaurants, services, places of worship, and community resources in Richmond, BC.
permalink: /directory/
body_class: directory-page
include_directory_script: true
---

{% assign businesses = site.data.businesses %}
{% assign categories = businesses | map: "category" | uniq | sort %}

<section class="page-hero page-hero--directory">
  <div class="page-hero__content">
    <p class="eyebrow">Community Directory</p>
    <h1>Find Indian businesses, services, and community resources in Richmond, BC.</h1>
    <p class="page-lead">Browse restaurants, educators, realtors, groceries, places of worship, movers, rentals, and local services shared by the community.</p>
    <div class="hero-actions">
      <a class="button button--primary" href="https://chat.whatsapp.com/EN5FnmJ9L62IYT3iKOckdJ" target="_blank" rel="noopener">Add Your Listing</a>
      <a class="button button--ghost" href="#browse">Browse Listings</a>
    </div>
  </div>
  <aside class="page-hero__panel" aria-label="Directory summary">
    <div class="hero-panel-card">
      <p class="hero-panel__eyebrow">Directory at a Glance</p>
      <ul class="hero-panel__stats">
        <li><strong>{{ businesses | size }}</strong> listings</li>
        <li><strong>{{ categories | size }}</strong> categories</li>
        <li><strong>1</strong> community hub</li>
      </ul>
      <p class="hero-panel__text">Use search or filters below to get to the right contact quickly.</p>
    </div>
  </aside>
</section>

<section class="content-section content-section--tight" id="browse" aria-label="Business directory">
  {% include directory-browser.html %}
</section>
