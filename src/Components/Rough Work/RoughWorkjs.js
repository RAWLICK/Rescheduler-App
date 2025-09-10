const function1 = () => {
    console.log("Function 1 is called");
    function function2() {
        console.log("Function 2 is called");
    }
    function2();
}
function1();