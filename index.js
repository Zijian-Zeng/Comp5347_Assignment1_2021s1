window.onload = () => {
  let bookList = [];
  const cart = [];

  function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success) success(JSON.parse(xhr.responseText));
        } else {
          if (error) error(xhr);
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }

  getJsonObject(
    'data.json',
    function (data) {
      bookList = data;
      const categoriesNode = document.querySelector('select#categories');
      const tbodyNode = document.querySelector('#listBox table tbody');
      const filterButtonNode = document.querySelector('#filterButton');
      const searchTextNode = document.querySelector('#searchText');
      const searchButtonNode = document.querySelector('#searchButton');
      const addButtonNode = document.querySelector('#addButton');
      const resetButtonNode = document.querySelector('#resetButton');
      const cartNode = document.querySelector('#cartNum');
      const darkModeNode = document.querySelector('#darkMode');

      //Clear checkbox function
      const clearCheckbox = () => {
        tbodyNode.childNodes.forEach((rowNode) => {
          //Find out the rows with a valid checkbox
          if (rowNode.nodeType !== Node.ELEMENT_NODE) return;
          const checkboxNode = rowNode.querySelector('.checkbox');
          if (!checkboxNode) return;
          //Clear the checkbox
          checkboxNode.checked = false;
        });
      };

      //Filter Action
      filterButtonNode.onclick = () => {
        clearCheckbox();
        bookList.map((book, index) => {
          const rowNode = document.querySelector('#row' + index);
          rowNode.style.display = '';
          if (
            book.category !== categoriesNode.value &&
            categoriesNode.value !== 'Category'
          ) {
            rowNode.style.display = 'none';
          }
        });
      };

      //Search Action
      searchButtonNode.onclick = () => {
        let notFound = true;
        bookList.map((book, index) => {
          const rowNode = document.querySelector('#row' + index);
          rowNode.style.backgroundColor = '';

          if (
            book.title
              .toUpperCase()
              .includes(searchTextNode.value.toUpperCase()) &&
            searchTextNode.value !== ''
          ) {
            rowNode.style.backgroundColor = '#00ff90';
            notFound = false;
          }
        });
        if (notFound && searchTextNode.value !== '') alert('Item Not Found.');
      };

      //Add to cart Action
      addButtonNode.onclick = () => {
        tbodyNode.childNodes.forEach((rowNode) => {
          //Find out the rows with a valid checkbox
          if (rowNode.nodeType !== Node.ELEMENT_NODE) return;
          const checkboxNode = rowNode.querySelector('.checkbox');
          if (!checkboxNode) return;

          //Add selected items to cart
          if (checkboxNode.checked) {
            checkboxNode.checked = false;
            cart.push(rowNode);
          }
        });
        cartNode.innerHTML = '(' + cart.length + ')';
      };

      //Reset cart Action
      resetButtonNode.onclick = () => {
        if (confirm('This will Empty Your Shopping Cart. Proceed?')) {
          cart.splice(0, cart.length);
          clearCheckbox();
          cartNode.innerHTML = '(' + cart.length + ')';
        }
      };

      //Dark mode Action
      darkModeNode.onclick = () => {
        if (darkModeNode.checked) {
          document.body.style.backgroundColor = 'black';
          document.body.style.color = 'white';

          document.querySelector('#listBox').style.backgroundColor = 'black';
          document.querySelector('#searchBox').style.backgroundColor =
            '#23819b';
          document.querySelector('#thread').style.backgroundColor = '#23819b';
        } else {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';

          document.querySelector('#listBox').style.backgroundColor = '';
          document.querySelector('#searchBox').style.backgroundColor = '';
          document.querySelector('#thread').style.backgroundColor = '#ebf4fb';
        }
      };

      //Render listBox based on the input bookList.
      const categories = [];
      console.log(bookList);
      bookList.map((book, index) => {
        //find out the categories.
        if (!categories.includes(book.category)) {
          categories.push(book.category);

          //render the categories.
          const categoryNode = document.createElement('option');
          categoryNode.innerHTML = book.category;
          categoryNode.setAttribute('value', book.category);
          categoriesNode.appendChild(categoryNode);
        }

        //render the books
        const bookNode = document.createElement('tr');
        let ratingHtml = '';

        //figure out the html for rating
        if (book.rating >= 0 && book.rating <= 5) {
          let i = 0;
          for (i = 0; i < 5 - book.rating; i++) {
            ratingHtml +=
              '<img class="star" src="./images/outline-star-16.ico" />';
          }
          for (i = 0; i < book.rating; i++) {
            ratingHtml += '<img class="star" src="./images/star-16.ico" />';
          }
        }

        bookNode.innerHTML =
          '<td><input type="checkbox" class="checkbox"></td>' +
          '<td><img src="' +
          book.img +
          '" height="100" width="80"/></td>' +
          '<td>' +
          book.title +
          ratingHtml +
          '</td>' +
          '<td>' +
          book.authors +
          '</td>' +
          '<td>' +
          book.year +
          '</td>' +
          '<td>' +
          book.price +
          '</td>' +
          '<td>' +
          book.publisher +
          '</td>' +
          '<td>' +
          book.category +
          '</td>';
        bookNode.setAttribute('id', 'row' + index);
        tbodyNode.append(bookNode);
      });

      //hide #notFound, if book(s) exist.
      if (bookList.length > 0) {
        document.querySelector('#notFound').style.display = 'none';
      }
    },
    function (xhr) {
      console.error(xhr);
    }
  );
};
