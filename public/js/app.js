'use strict';

$('.dropForm').on('click',function(event){
    const $id = $(event.target);
    const value = $id.val();
    $(`#${value}`).toggleClass('hide');
});

$('.show').on('click',function(){

})

$('.viewDetail').on('click',function(event){
    const $id = $(event.target);
    const value = $id.val();
    console.log(value);
    $.get(`/books/${value}`, ()=>{window.location.href = `/books/${value}`});
});

$('.updateDetail').on('click',function(event){
    $().toggleClass('hide');
})

$('.deleteBook').on('click', (event) => { 
    const $id = $(event.target);
    const value = $id.val();
    $.ajax({
        url: `/books/${value}`,
        type: 'DELETE',
        success: function(result) {window.location.href = '/'}
    })
})