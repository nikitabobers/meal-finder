const submit = document.getElementById("form-submit");
const submitInput = document.getElementById("input-value");
const btnRandom = document.getElementById("random");
const search = document.getElementById("result-search");
const searchTitle = document.querySelector(".result-search-title");
const displayData = document.querySelector(".result-data");
const displaySingleMealInfo = document.querySelector(".result-data-info");
const displayImg = document.querySelector(".images");

// Get meal from input
async function getSingleMeal(e) {
    displaySingleMealInfo.style.visibility = "hidden";

    e.preventDefault();
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
                      <div>
                        <div class="meal-info btn-scroll" data-mealID="${meal.idMeal}">
                          <h3>${meal.strMeal}</h3>
                        </div>
                      </div>
                    </div>
                    `
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

// Message
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

// Get meal
async function getMealId(mealID) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];
    displayMealInfo(meal);
}

// Get random meal btn
async function getRandomMeal(e) {
    e.preventDefault();
    displaySingleMealInfo.style.visibility = "visible";
    displayData.style.justifyContent = "center";
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    const meal = data.meals[0];
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

// Get meal ID by clicking on image
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

// Display text info about meal
function displayMealInfo(meal) {
    displaySingleMealInfo.style.visibility = "visible";

    // problems in player with original url request
    const playerOriginal = meal.strYoutube;
    const playerNew = playerOriginal.replace("watch?v=", "embed/");

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    displaySingleMealInfo.innerHTML = `
    <div class="text-info">
    <div class="meal-instruction window-1">${meal.strInstructions}</div>
    <div class="window-2">
      <div class="meal-description-box">
        <div class="name">Meal: ${meal.strMeal}</div>
        <div class="area">Kitchen: ${meal.strArea}</div>
        <div class="category">Category: ${meal.strCategory}</div>
      </div>
      <div class="meal-ingredients-box">
        <div class="meal-ingredients">
         <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
        </div>
      </div>
      <div>
      </div>
      </div>
    </div>
      <iframe width="420" height="315" src="${playerNew}"></iframe>
  `;
}

submit.addEventListener("submit", getSingleMeal);
random.addEventListener("click", getRandomMeal);
displayData.addEventListener("click", getMealInfo);
