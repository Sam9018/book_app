'use strict';

$('.dropForm').on('click',function(event){
    const $id = $(event.target);
    const value = $id.val();
    $(`#${value}`).toggleClass('hide');
})