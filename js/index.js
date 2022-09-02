document.addEventListener("DOMContentLoaded",() => {
    const form = document.querySelector("form#github-form")
    let clickedButton;
    let currentSearchType = "users"
    

    const searchType = document.createElement("button");
    searchType.id = "searchTypeBtn"
    searchTypeContent()

    function searchTypeContent(){
        if (currentSearchType === "users"){
            searchType.textContent = "Search For Repos Instead"
        } else{
            searchType.textContent = "Search for Users Instead"
        }
    }
    const divSection = document.querySelector("div#github-container")
    document.querySelector("div#main").insertBefore(searchType, divSection);

   document.getElementById("searchTypeBtn").addEventListener("click", function(){
    if (currentSearchType === "users"){
        currentSearchType = "repos"
    }else{
        currentSearchType = "users"
    }
    searchTypeContent()
   })


    form.addEventListener("submit", (e) =>{
        document.querySelector("ul").innerHTML = "";
        e.preventDefault();
        search = document.querySelector("input#search");
        searchDestination = e.target.search.value
        if (currentSearchType === "users"){
            getUsers()
        } else{
            getRepos()
        }
        
    })

    function listRepos(reposObj){
        let addedRepo = document.createElement("p")
        addedRepo.innerHTML = `<a href="${reposObj.html_url}">${reposObj.name}</a>`
        document.querySelector(`li#${clickedButton}`).appendChild(addedRepo)
    }

    function searchRepos(){
        clickedButton = event.target.id;
        const clickedUser = event.target.id;
        fetch(`https://api.github.com/users/${clickedUser}/repos`)
        .then(resp => resp.json())
        .then(data => data.forEach(obj => listRepos(obj)))
    }


    function addResultsToDom(dataItems){
        
        const users = document.querySelector("ul#user-list");
        const newLi = document.createElement("li");
        newLi.innerHTML = `<h4>Username:</h4>
        <p id=${dataItems.login}>${dataItems.login}</p>
        <img src= "${dataItems.avatar_url}" alt = "${dataItems.login}_avatar">
        <br>
        <a href = "${dataItems.html_url}">Link To Profile</a>
        <br>
        <button type="button">Repos</button>`

        newLi.id = dataItems.login

        newLi.querySelector("button").id = dataItems.login
        newLi.querySelector("button").addEventListener("click", searchRepos)



        users.appendChild(newLi)

    }

    function addReposToDom(repoObj){
        const repos = document.querySelector("ul#repos-list");
        const newLi = document.createElement("li");

        newLi.innerHTML = `<a href = "${repoObj.html_url}">${repoObj.name}</a>.`
        
        console.log(repoObj.html_url)

        
        repos.appendChild(newLi)
    }

    function getUsers(){
        
        fetch(`https://api.github.com/search/users?q=${searchDestination}`)
        .then(resp => resp.json())
        .then(data => data.items.forEach(obj => addResultsToDom(obj)))
    }


    function getRepos(){
        fetch(`https://api.github.com/search/repositories?q=${searchDestination}+language:assembly&sort=stars&order=desc`)
        .then(resp => resp.json())
        .then(data => data.items.forEach(obj => addReposToDom(obj)))
    }

})