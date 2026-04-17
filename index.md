---
layout: default
title: Indians in Richmond, BC
description: Community hub for Indian businesses, events, and connections in Richmond, BC.
permalink: /
body_class: home-page
event_banner: true
---

{% assign businesses = site.data.businesses %}
{% assign categories = businesses | map: "category" | uniq | sort %}

<section class="home-hero">
  <div class="home-hero__content">
    <p class="eyebrow">Community hub for Richmond, British Columbia</p>
    <h1>I.R.B.C.</h1>
    <p class="page-lead">Discover local businesses, follow community events, and stay connected with neighbours.</p>
    <form class="hero-search" action="{{ '/directory/' | relative_url }}" method="get" role="search">
      <label class="sr-only" for="home-directory-search">Search the directory</label>
      <input id="home-directory-search" name="q" type="search" placeholder="Search restaurants, realtors, temples, groceries...">
      <button class="button button--accent" type="submit">Search Directory</button>
    </form>
    <div class="hero-actions">
      <a class="button button--primary" href="{{ '/directory/' | relative_url }}">Explore the Directory</a>
      <a class="button button--ghost" href="#connect">Connect with Us</a>
    </div>
  </div>
  <aside class="home-hero__visual" aria-label="Community illustration">
    <img src="{{ '/assets/img/community-hero.png' | relative_url }}" alt="Illustration of a Richmond community gathering">
    <div class="hero-visual-caption">
      <span>Local listings, events, and connections in one place.</span>
    </div>
  </aside>
</section>

<section class="impact-strip" aria-label="Community impact summary">
  <div class="impact-number">
    <strong>{{ businesses | size }}</strong>
    <span>Local Listings</span>
  </div>
  <div class="impact-number">
    <strong>{{ categories | size }}</strong>
    <span>Service Categories</span>
  </div>
  <div class="impact-number">
    <strong>3</strong>
    <span>Ways to Connect</span>
  </div>
</section>

<section class="content-section" id="about">
  <div class="section-heading">
    <p class="eyebrow">About Us</p>
    <h2>A simpler place to find and support the community.</h2>
  </div>
  <p class="section-intro">Indians in Richmond, BC is a volunteer-built hub for families, students, newcomers, and long-time residents who want an easier way to discover local businesses, cultural resources, events, and community contacts.</p>
  <div class="feature-grid">
    <article class="feature-card">
      <h3>Discover Local</h3>
      <p>Use the directory to find restaurants, groceries, services, educators, places of worship, realtors, rentals, and more.</p>
    </article>
    <article class="feature-card">
      <h3>Celebrate Together</h3>
      <p>Follow community events and cultural celebrations, starting with the Richmond Holi 2026 event page.</p>
    </article>
    <article class="feature-card">
      <h3>Share Resources</h3>
      <p>Access community documents and contribute improvements through the shared library and GitHub repository.</p>
    </article>
  </div>
</section>

<section class="content-section" id="events">
  <div class="section-heading">
    <p class="eyebrow">Events</p>
    <h2>Celebrate and stay updated.</h2>
  </div>
  <div class="event-banner-card">
    <div>
      <p class="spotlight-date">Saturday, April 25, 2026</p>
      <h3>Richmond Holi 2026</h3>
      <p>Visit the event page for RSVP details, ticket information, and the event QR code.</p>
    </div>
    <a class="button button--light" href="{{ '/holi/' | relative_url }}">View Holi Details</a>
  </div>
  <div class="spotlight-grid spotlight-grid--support">
    <article class="spotlight-card">
      <p class="spotlight-date">Community Calendar</p>
      <h3>Follow meetups and updates</h3>
      <p>Facebook events remains the quickest place to track meetups, gatherings, and new announcements.</p>
      <a class="button button--ghost" href="https://www.facebook.com/groups/900644660267654/events" target="_blank" rel="noopener">Open Facebook Events</a>
    </article>
  </div>
</section>

<section class="content-section" id="directory-preview">
  <div class="section-heading">
    <p class="eyebrow">Directory</p>
    <h2>Start with the local directory.</h2>
  </div>
  <div class="directory-preview">
    <div class="directory-preview__content">
      <p>All existing listings now live on a dedicated directory page so the homepage stays easy to navigate. Browse by category, search by phone number, or send a WhatsApp message to add a new listing.</p>
      <div class="category-chip-row" aria-label="Available directory categories">
        {% for category in categories limit: 6 %}
          {% capture category_label %}{% include category-label.html category=category %}{% endcapture %}
          <a href="{{ '/directory/' | relative_url }}">{{ category_label | strip }}</a>
        {% endfor %}
      </div>
      <div class="section-actions">
        <a class="button button--primary" href="{{ '/directory/' | relative_url }}">Open the Directory</a>
        <a class="button button--ghost" href="https://chat.whatsapp.com/EN5FnmJ9L62IYT3iKOckdJ" target="_blank" rel="noopener">Add or Update a Listing</a>
        <a class="text-link" href="{{ '/directory/#browse' | relative_url }}">View all categories</a>
      </div>
    </div>
    <aside class="directory-preview__panel" aria-label="Community resources">
      <h3>Community Documents</h3>
      <p>Open the shared library for community files, forms, and event documents.</p>
      <a class="text-link" href="{{ '/library/' | relative_url }}">Open the Library</a>
    </aside>
  </div>
</section>

<section class="content-section" id="connect">
  <div class="section-heading">
    <p class="eyebrow">Connect with Us</p>
    <h2>Join the conversation.</h2>
  </div>
  <p class="section-intro">Stay in touch through the channels the community already uses every day.</p>
  {% include social-links.html %}
</section>
