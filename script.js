const submit = document.getElementById("form-submit");
const submitInput = document.getElementById("input-value");
const btnRandom = document.getElementById("random");
const search = document.getElementById("result-search");
const searchTitle = document.querySelector(".result-search-title");
const displayData = document.querySelector(".result-data");
const displayImg = document.querySelector(".images");

async function getSingleMeal(e) {
  e.preventDefault();

  const input = submitInput.value;

  if (input.trim()) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`);
    const data = await res.json();

    if (data.meals !== null) {
      const meal = data.meals;
      console.log(meal);
      searchTitle.style.display = "initial";
      search.innerHTML = input;
      displayData.innerHTML = meal
        .map(
          meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="">
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>`
        )
        .join("");
    } else {
      showMessage("error alert", "No results");
      searchTitle.style.display = "none";
    }
  } else {
    showMessage("error alert", "Please fill search area");
    searchTitle.style.display = "none";
  }
  submitInput.value = "";
}

function showMessage(className, message) {
  clearAlert();
  const search = document.querySelector(".search");
  let div = document.createElement("div");
  div.className = className;
  div.innerHTML = message;
  search.appendChild(div);

  setTimeout(function() {
    div.remove();
  }, 1500);
}
function clearAlert() {
  const currentAlert = document.querySelector(".alert");
  if (currentAlert) {
    currentAlert.remove();
  }
}

async function getRandomMeal(e) {
  e.preventDefault();
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  const meal = data.meals[0];
  console.log(meal);
  searchTitle.style.display = "initial";
  searchTitle.innerHTML = "Random meal results";
  displayData.innerHTML = `
  <div class="meal">
    <img src="${meal.strMealThumb}" alt="">
    <div class="meal-info" data-mealID="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
    </div>
  </div>`;
}

async function getMealInfo(e) {
  const res = await `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
  const data = await res.json();
  console.log(data);
}

submit.addEventListener("submit", getSingleMeal);
random.addEventListener("click", getRandomMeal);
displayData.addEventListener("člick", getMealInfo);
