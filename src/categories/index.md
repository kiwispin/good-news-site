---
title: Categories
layout: base.njk
---

## Browse by category

<ul class="list-disc pl-6 space-y-1">
{% for cat in ["Environment","Health","Innovation","Human Kindness"] %}
  <li>
    <a class="text-blue-700 underline" href="/{{ cat | slug }}/">
      {{ cat }}
    </a>
  </li>
{% endfor %}
</ul>
