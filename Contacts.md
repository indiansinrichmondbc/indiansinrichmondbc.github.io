---
layout: default
---

# Indians in Richmond: Contacts
<button onclick="window.history.back()">Back</button>

<div id="filter">
  <label for="category-filter">Filter by Category:</label>
  <select id="category-filter">
    <option value="all">All Categories</option>
    <option value="dentist">Dentist</option>
    <option value="education">Education</option>
    <option value="gurdwara">Gurdwara</option>
    <option value="insurance">Insurance</option>
    <option value="realtor">Realtor</option>
    <option value="restaurants">Restaurants</option>
    <option value="rv rentals">RV Rentals</option>
    <option value="sports">Sports</option>
    <option value="temple">Temple</option>
  </select>
</div>

| Name                      | Category   | Contact         | Link                                 |
|---------------------------|------------|-----------------|--------------------------------------|
| Dr Sanju John             | Dentist    | [778 251-6592](tel:+17782516592) |                                      |
| Hindi Classes at Temple   | Education  |                 | [WhatsApp](https://chat.whatsapp.com/GnJPe7uFS2eCZqMkEG1EK5) |
| Dance Academy             | Education  |                 | [Facebook](https://www.facebook.com/SudnyaDanceAcademy) |
<!-- Add more contacts alphabetically -->

<script>
  function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("yellow-pages");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[columnIndex];
        y = rows[i + 1].getElementsByTagName("td")[columnIndex];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  document.getElementById("category-filter").addEventListener("change", function() {
    var category = this.value;
    var rows = document.getElementById("yellow-pages").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
      var categoryCell = rows[i].getElementsByTagName("td")[1];
      if (category === "all" || categoryCell.textContent.toLowerCase() === category) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  });
</script>
