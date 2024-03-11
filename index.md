---
layout: default
---

<div class="container">
  <div class="intro">
    <h4>The Best of Indian Community and Businesses in Richmond</h4>
    <p><a href="mailto:yourbusiness@gmail.com" class="btn btn-info"><img src="/assets/img/gmail.svg" alt="Email Icon" width="24" height="24"> <strong>Add/edit contacts</strong></a></p>
  </div>

  <div id="filter" style="text-align: center;">
    <label for="category-filter">Category:</label>
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
        <th>Email/Website</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Best Bite</td>
        <td>Restaurants</td>
        <td><a href="tel:+16043704949">604 370-4949</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Biryani Bhai</td>
        <td>Restaurants</td>
        <td><a href="tel:+17782976961">778 297-6961</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Dance Academy</td>
        <td>Education</td>
        <td></td>
        <td><a href="https://www.facebook.com/SudnyaDanceAcademy" target="_blank">Facebook</a></td>
      </tr>
      <tr>
        <td>Dr Sanju John</td>
        <td>Dentist</td>
        <td><a href="tel:+17782516592">778 251-6592</a></td>
        <td></td>
      </tr>
      <tr>
        <td>Ember Kitchen</td>
        <td>Restaurants</td>
        <td><a href="tel:+16043704485">604 370-4485</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Exotic International</td>
        <td>Grocery</td>
        <td><a href="tel:+16044475228">604 447-5228</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Fruiticana</td>
        <td>Grocery</td>
        <td><a href="tel:+16042449520">604 244-9520</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Ginger</td>
        <td>Restaurants</td>
        <td><a href="tel:+16043701300">604 370-1300</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Himalaya</td>
        <td>Restaurants</td>
        <td><a href="tel:+16042472252">(604) 247-2252</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Hindi Classes at Temple</td>
        <td>Education</td>
        <td></td>
        <td><a href="https://chat.whatsapp.com/GnJPe7uFS2eCZqMkEG1EK5" target="_blank">WhatsApp</a></td>
      </tr>
      <tr>
        <td>Joe & Joe Realty</td>
        <td>Realtor</td>
        <td><a href="tel:+17788699091">778 869-9091</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Murugan Temple</td>
        <td>Temple</td>
        <td><a href="tel:+16042317649">604 231-7649</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Naman Nagpaul</td>
        <td>Realtor</td>
        <td><a href="tel:+17788460747">778 846-0747</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Nanak Niwas Gurdwara</td>
        <td>Gurdwara</td>
        <td><a href="tel:+16042747479">604 274-7479</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Nanaksar Gurdwara</td>
        <td>Gurdwara</td>
        <td><a href="tel:+16042707369">604 270 7369</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Navjot Gahley</td>
        <td>Insurance</td>
        <td><a href="tel:+17787884464">778 788-4464</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Phoenix</td>
        <td>Sports</td>
        <td><a href="tel:+"></a></td>
        <td><a href="https://www.facebook.com/phoenix.richmond.malayalee">Facebook</a></td>
      </tr>
      <tr>
        <td>Reeba Elizabeth</td>
        <td>Investment</td>
        <td><a href="tel:+17789179812">778 917-9812</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Richmond Pizza</td>
        <td>Restaurants</td>
        <td><a href="tel:+16042707777">604 270-7777</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Sabji Mandi</td>
        <td>Grocery</td>
        <td><a href="tel:+16042852400">604 285-2400</a></td>
        <td><a href="#"></a></td>
      </tr>
      <tr>
        <td>Sommi</td>
        <td>Realtor</td>
        <td><a href="tel:+17783186693">778 318-6693</a></td>
        <td><a href="#"></a></td>
      </tr>
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
