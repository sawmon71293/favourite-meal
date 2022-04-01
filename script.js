const mealsEl=document.getElementById('randomMeal');
const favouriteContainer=document.getElementById('favourite');
const searchTerm=document.getElementById('search-term');
const searchBtn=document.getElementById('search');
const mealPopup= document.getElementById('meal-popup');
const popupCloseBtn=document.getElementById('close-popup');
const mealInfoEl= document.getElementById('meal-info');
getRandomMeal();
fetchFavMeals();
async function getRandomMeal(){
    const response= await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
     const responseData=await response.json();
     const randomMeal=responseData.meals[0];
     addMeal(randomMeal,random=true);
}

 function showMealInfo(mealData){
        // clean it up
        mealInfoEl.innerHTML='';
        //update meal info
      const mealEl =document.createElement('div');
      const ingredient =[];
      for(let i=1;i<20;i++){
             if(mealData['strIngredient'+i]){
                 ingredient.push(`${mealData['strIngredient'+i]}/ ${mealData['strMeasure'+i]}`)
             }else{
              break;
       }

      }
      mealInfoEl.appendChild(mealEl);
      mealEl.innerHTML=`<h1>${mealData.strMeal}</h1>
                      <img
                      src="${mealData.strMealThumb}"  alt="" />
                      </div>
                      <div>
                      <p>
                      ${mealData.strInstructions}
                      </p>
                      <h3>Ingredients:</h3>
                      <ul>
                      ${ingredient.map(ing => 
                            `<li>${ing}</li>`).join('')}
                      </ul>`
      //show popup
      mealPopup.classList.remove('hide');
 }
async function getMealById(id){
       
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
      const responseData= await response.json();
      const meal=responseData.meals[0];
      return meal;
}

async function getMealBySearch(term){

       const response= await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" +term);
       const responseData= await response.json();
       const meals= responseData.meals;
     
        return meals;

}


function addMeal(randomMeal,random=false){
    const meal=document.createElement('div');
    
    meal.classList.add('meal');
    console.log("random Meal is : "+ randomMeal.strMeal);
    meal.innerHTML =`<div class="meal-header">
                      ${random ? `<span class="random">Random Recipe</span>`: ''}
                    
                    <img src="${randomMeal.strMealThumb}" alt="${randomMeal.strMeal}">
                     </div>
                    <div class="meal-body">
                     <h4> ${randomMeal.strMeal}</h4>
                     <button class="fav-btn" id="fav-btn">
                    <i class="fas fa-heart"></i>
                     </button>
                    </div>`;
                    const btn= meal.querySelector(".fav-btn");
                   btn.addEventListener("click", ()=>{
                     if(btn.classList.contains('active')){
                            removeMealLs(randomMeal.idMeal);
                            btn.classList.remove('active');
                     }
                     else{
                            addMealLs(randomMeal.idMeal);
           
                            btn.classList.add('active');
                     }
                     
                    fetchFavMeals();   
                   });
                   meal.addEventListener('click',()=>{
                          showMealInfo(randomMeal);
                   })
       
       
         
        mealsEl.appendChild(meal);

}



function addMealLs(mealId){
       const mealIds= getMealLs();
      localStorage.setItem("mealIds", JSON.stringify([...mealIds,mealId]));
      
}

function removeMealLs(mealId){
   const meals=getMealLs();
    console.log("meal ids :"+meals);
    let callback = meal => meal !== mealId;
     localStorage.setItem("mealIds", JSON.stringify(meals.filter(callback)));
}

function getMealLs(){
const mealIds=JSON.parse(localStorage.getItem("mealIds"));
return mealIds === null ?[] :mealIds;
}

async function fetchFavMeals(){
       //clean container
       favouriteContainer.innerHTML = '';
       const mealIds = getMealLs();
       for(let i=0; i<mealIds.length; i++) 
          {
           const mealId=mealIds[i] ;
         var  meal =await getMealById(mealId);
             addMealFav(meal);  
             console.log(meal);
          }
    
}

function addMealFav(favMeal){
       const favourite=document.createElement('li');
      

       
      favourite.innerHTML =`<img src="${favMeal.strMealThumb}" alt="${favMeal.strMeal}">
                         <span>${favMeal.strMeal}</span> </img>
                         <button class="clear"><i class="fas fa-window-close"></i></button>`;
       const btn=favourite.querySelector(".clear");
       btn.addEventListener('click', ()=>{
            removeMealLs(favMeal.idMeal);
            fetchFavMeals();
       });
       favourite.addEventListener('click',()=>{
              showMealInfo(favMeal);
       })
          favouriteContainer.appendChild(favourite);
      
   }


searchBtn.addEventListener('click',async ()=>{
       //clean the container
       mealsEl.innerHTML='';
            const search= searchTerm.value;
           const meals= await getMealBySearch(search);
           meals.forEach(meal =>{
                  addMeal(meal);
           })
});


popupCloseBtn.addEventListener('click',()=>{
       mealPopup.classList.add('hide');
})