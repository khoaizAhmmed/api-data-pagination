// Api data store in Array
let amazonNewsDataList = []
const cardElement = document.getElementById('cards')
const viewPerPage = 5
const currentPageNo =1

// Api method Url Headers
var options = {
  method: 'GET',
  url: 'https://amazon-news.p.rapidapi.com/',
  headers: {
    'x-rapidapi-host': 'amazon-news.p.rapidapi.com',
    'x-rapidapi-key': 'f2407bf378msh5f158cdc2b54aa9p1b6355jsn322cd212842c'
  }
};

// Api call function
async function showData(link){
  let list = []
  let newsData = await axios(link)
  list.push(newsData.data)
  let [amazonData] = list
  amazonNewsDataList.push(amazonData)
}

// Pagination Array
const pageNumbers = (total ,max,current)=>{
  const half = Math.floor(max/2);
  let to = max
  if(current+half>=total){
    to = total;
  }else if(current>half){
    to = current + half
  }
  let from = to - max
  return Array.from({length:max},(_,i)=>(i+1) + from)
}

//Pagination Button action function

function PaginationButtons(totalPages, maxPageVisible =10, currentPage = 1){
  let pages = pageNumbers(totalPages, maxPageVisible, currentPage) 
  let currentPageBtn = null;
  const buttons = new Map()
  const fragment = document.createDocumentFragment()
  const paginationButtonContainer = document.createElement('div');
  paginationButtonContainer.className = 'pagination-buttons'

  const disabled = {
    start : ()=> pages[0] === 1,
    prev : ()=> currentPage === 1,
    end : ()=> pages.slice(-1)[0] === totalPages,
    next : ()=> currentPage === totalPages,
  }
  
  // Create Button and button details

  const createAndSetupButtons = (label = '', cls = '', disabled = false, handleClick = () => {} )=>{
    const button = document.createElement('button');
    button.textContent = label;
    button.className = `page-btn ${cls}`
    button.disabled = disabled
    button.addEventListener('click',event =>{
      handleClick(event);
      this.update();
      paginationButtonContainer.value = currentPage;
      paginationButtonContainer.dispatchEvent(new Event('change'));
    })
    return button
  }
  
  const onPageButtonClick = e => currentPage = Number(e.currentTarget.textContent)
  
  const onPageButtonUpdate = index => btn => {
    btn.textContent = pages[index]
    if(pages[index]=== currentPage){
      currentPageBtn.classList.remove('active')
      btn.classList.add('active')
      currentPageBtn = btn ;
      currentPageBtn.focus()
      
    }
  }
  
  buttons.set(createAndSetupButtons('start', 'start-page',disabled.start(),() => currentPage = 1),(btn)=> btn.disabled = disabled.start()
  )
  buttons.set(createAndSetupButtons('prev', 'prev-page', disabled.prev(), () =>  currentPage -= 1),(btn)=> btn.disabled = disabled.prev()
  )

  pages.forEach((pageNumber,index)=>{
    const isCurrentPage = pageNumber === currentPage
    const button = createAndSetupButtons(pageNumber, isCurrentPage? 'active' : '', false,  onPageButtonClick )
    if(isCurrentPage){
      currentPageBtn = button;
    }
    buttons.set(button,onPageButtonUpdate(index))
  })
  

  buttons.set(createAndSetupButtons('next', 'next-page', disabled.next(),() => currentPage +=1 ),(btn)=> btn.disabled = disabled.next()
  )
  
  
  buttons.set(createAndSetupButtons('end', 'end-page', disabled.end(), () => currentPage = totalPages),(btn)=> btn.disabled = disabled.end()
  )
  buttons.forEach((_,btn)=>{
      fragment.appendChild(btn)
  })
  
  this.render = (container = document.body)=>{
    paginationButtonContainer.appendChild(fragment)
    container.appendChild(paginationButtonContainer)
  }

  this.update = (newPageNumber = currentPage)=>{
    currentPage = newPageNumber
    pages = pageNumbers(totalPages,maxPageVisible,currentPage)
    buttons.forEach((updateButton, button) => updateButton(button))
  }
  this.onChange = (handler) => {
    paginationButtonContainer.addEventListener('change', handler);
  }
}

// Api data show in web page

function displayData (items, wapper, rowsPerPage, page){
  wapper.innerHTML = ""
  page--;
  const start = rowsPerPage * page 
  const end = start + rowsPerPage
  const paginateItems = items.slice(start,end)

  for(let i = 0; i<paginateItems.length; i++) {
    let data = paginateItems[i]
    let createCard = document.createElement('li')
    createCard.className = 'cards_item'
    let card = document.createElement('div')
    card.className = 'card'
    let cardImage = document.createElement('div')
    cardImage.className = 'card_image'
    let image = document.createElement('img')
    image.src = data.thumbnail
    let cardContent = document.createElement('div')
    cardContent.className = 'card_content'
    let cardTitle = document.createElement('p')
    cardTitle.className = 'card_text'
    cardTitle.textContent = data.title
    let cardButton = document.createElement('button')
    cardButton.className = 'btn card_btn'
    cardButton.textContent = 'Read more'
    let cardLink = document.createElement('a')
    cardLink.className = 'btn card_btn'
    cardLink.textContent = 'Read More'
    cardLink.target = "_blank"
    cardLink.href = data.link 

    
    card.appendChild(cardImage)
    cardImage.appendChild(image)
    card.appendChild(cardContent)
    cardContent.appendChild(cardTitle)
    cardContent.appendChild(cardLink)
    createCard.appendChild(card)

    wapper.append(createCard)
  }
  
}

// Asynchronous data catch and show

async function show(){
  await showData(options)
  const [amazonData] =amazonNewsDataList


  let pageCount = Math.ceil(amazonData.length / viewPerPage)

 // Pagination Button

  const paginationButtons = new PaginationButtons(pageCount,5)

  paginationButtons.render()

  paginationButtons.onChange(e => {
  displayData(amazonData, cardElement, viewPerPage,e.target.value )
});

  displayData(amazonData, cardElement, viewPerPage,currentPageNo)
}

// Data Show function Call
show()


