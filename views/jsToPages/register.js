/*

pre-code, using ejs:


<ul>
    <% if(typeof errors != 'undefined' ) { %> <% errors.forEach(error=>{ %>
    <li><%= error.message %></li>
    <% }) %> <% } %>
  </ul>




  
  */