task1 = ()=>{
    setTimeout(()=>{
        console.log(1)
    },500)  
}
task2 = ()=>{
    setTimeout(()=>{
        console.log(2)
    },100)  
}
task3 = ()=>{
    setTimeout(()=>{
        console.log(3)
    },1000)  
}

main = async () =>{
    await task1()
    await task2()
    await task3()
}

main()


