document.getElementById("trialForm").addEventListener("submit", function(event){
    event.preventDefault();

    alert("Thank you! Your free trial class request has been received.");

    this.reset();
});
