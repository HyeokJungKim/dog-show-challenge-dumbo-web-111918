document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body')
  const dogForm = document.getElementById('dog-form')

  fetch("http://localhost:3000/dogs")
  .then(res => {
    return res.json()
  })
  .then(dogs => dogs.forEach(dog => {
    tableBody.append(makeTableRow(dog))
  }))

  tableBody.addEventListener("click", (event) => {
    if(event.target.className === "button"){
      const button = event.target
      const id = button.getAttribute("data-id")
      // Do this differently?
      const row = button.parentElement.parentElement
      const cells = row.querySelectorAll("td")
      const nameCell = cells[0]
      const breedCell = cells[1]
      const genderCell = cells[2]
      
      dogForm.name.value = nameCell.innerText
      dogForm.breed.value = breedCell.innerText
      dogForm.sex.value = genderCell.innerText
      dogForm.setAttribute('data-id', id)
    }
  })

  dogForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const form = event.target
    const id = form.getAttribute("data-id")
    const newName = form.name.value
    const newBreed = form.breed.value
    const newSex = form.sex.value

    const objectToSendBack = {
      name: newName,
      sex: newSex,
      breed: newBreed
    }

    fetch(`http://localhost:3000/dogs/${id}`, {
      method: "PATCH",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objectToSendBack)
    })
    .then(res => res.json())
    .then(response => {

      // METHOD 1 IS DOM MANIPULATION (ANIK)

      const button = tableBody.querySelector(`[data-id="${id}"]`)
      // Get the element who's data-id is that id
      button.parentElement.parentElement.remove()
      tableBody.prepend(makeTableRow(response))
      // form.reset()
      // form.setAttribute("data-id", "")

      // METHOD 2 IS DOM MANIPULATION

      // const buttons = tableBody.querySelectorAll("tr > td > button")
      // buttons.forEach(button => {
      //
      //   if(button.getAttribute("data-id") === id){
      //     button.parentElement.parentElement.remove()
      //     tableBody.prepend(makeTableRow(response))
      //   }
      // })


      // METHOD 3 IS FETCH-CEPTION

      // fetch("http://localhost:3000/dogs")
      // .then(res => res.json())
      // .then(dogs => {
      //   tableBody.innerHTML = ""
      //   dogs.forEach(dog => {
      //     tableBody.append(makeTableRow(dog))
      //   })
      // })

    })
  })

})//DOMCONTENTLOADED ENDS HERE

function makeTableRow(dog){
  let tableRow = document.createElement("tr")
  tableRow.innerHTML = `<td class="name">${dog.name}</td>
  <td class="breed">${dog.breed}</td>
  <td class="sex">${dog.sex}</td>
  <td><button data-id=${dog.id} class="button">Edit</button></td>`
  return tableRow
}
