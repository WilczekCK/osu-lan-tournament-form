var form_valid = form_valid || {};

form_valid = {
    recognize: function(input, value){
        switch(input){
            case 'email':
                console.log('E-Mail is selected')
                console.log(value)
                break;
            case 'id':
                console.log('ID is Selected')
                console.log(value)
                break;
        }
    },
    validations:{
    }
}

$('input').on('keydown', function(){
    form_valid.recognize(this.name, this);
})