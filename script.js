const submit = document.getElementById("form-submit");
const submitInput = document.getElementById("input-value");
const btnRandom = document.getElementById("random");
const search = document.getElementById("result-search");
const searchTitle = document.querySelector(".result-search-title");
const displayData = document.querySelector(".result-data");
const displaySingleMealInfo = document.querySelector(".result-data-info");
const displayImg = document.querySelector(".images");

async function getSingleMeal(e) {
  e.preventDefault();
  displaySingleMealInfo.innerHTML = "";
  const input = submitInput.value;

  if (input.trim()) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`);
    const data = await res.json();
    if (data.meals !== null) {
      const meal = data.meals;
      searchTitle.style.display = "initial";
      search.innerHTML = input;
      displayData.innerHTML = meal
        .map(
          meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="">
              <div class="meal-info btn-scroll" data-mealID="${meal.idMeal}">
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

async function getMealId(mealID) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  const data = await res.json();
  const meal = data.meals[0];
  displayMealInfo(meal);
}
async function getRandomMeal(e) {
  e.preventDefault();
  displaySingleMealInfo.innerHTML = "";
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  const meal = data.meals[0];
  console.log(meal);
  searchTitle.style.display = "initial";
  searchTitle.innerHTML = "Random meal results";
  displayData.innerHTML = `
  <div class="meal ">
    <img src="${meal.strMealThumb}" alt="">
    <div class="meal-info btn-scroll" data-mealID="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
    </div>
  </div>`;
  displayMealInfo(meal);
}

function getMealInfo(e) {
  const info = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (info) {
    const mealID = info.getAttribute("data-mealID");
    getMealId(mealID);
  }
}

function displayMealInfo(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  displaySingleMealInfo.innerHTML = `
    <div class="meal-instruction window-1">${meal.strInstructions}</div>
    <div class="window-2">
      <div class="meal-description-box">
        <div class="name">${meal.strMeal}</div>
        <div class="area">${meal.strArea}</div>
        <div class="category">${meal.strCategory}</div>
      </div>
      <div class="meal-ingredients-box">
        <div class="meal-ingredients">
         <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
        </div>
        <div class="meal-measures"></div>
      </div>
    </div>
  `;
}

submit.addEventListener("submit", getSingleMeal);
random.addEventListener("click", getRandomMeal);
displayData.addEventListener("click", getMealInfo);
