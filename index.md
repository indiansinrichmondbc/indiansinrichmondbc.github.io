---
layout: default
---

<div class="container">
  <div class="intro">
    <h3>Discover the Best of Indian Community and Businesses in Richmond</h3>
    <p>Connect, share, and stay informed with us.</p>
  </div>

  <div class="join-links">
    <p>Join us on:</p>
    <ul>
      <li><a href="https://www.facebook.com/groups/900644660267654"><i class="fab fa-facebook"></i> Facebook</a></li>
      <li><a href="https://chat.whatsapp.com/GnJPe7uFS2eCZqMkEG1EK5"><i class="fab fa-whatsapp"></i> WhatsApp</a></li>
    </ul>
  </div>

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

  <table id="yellow-pages">
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Contact</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dr Sanju John</td>
        <td>Dentist</td>
        <td><a href="tel:+17782516592">778 251-6592</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Hindi Classes at Temple</td>
        <td>Education</td>
        <td></td>
        <td><a href="https://chat.whatsapp.com/GnJPe7uFS2eCZqMkEG1EK5" target="_blank">WhatsApp</a></td>
      </tr>
      <tr>
        <td>Dance Academy</td>
        <td>Education</td>
        <td></td>
        <td><a href="https://www.facebook.com/SudnyaDanceAcademy" target="_blank">Facebook</a></td>
      </tr>
      <!-- Add more contacts alphabetically -->
    </tbody>
  </table>
</div>

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
