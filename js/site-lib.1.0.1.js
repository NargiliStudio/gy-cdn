Vue.filter('formatNum', function (value) {
    if ((!value && value !== 0) || isNaN(value) || value > 9007199254740991) {
        return '-';
    } else {
        return numeral(value).format('0,0');
    }
});

Vue.component('input-num', {
    template: '<input type="text" ref="input" v-model="model" v-on:focus="selectAll" />',
    props: {
        value: {},
        decimal: {}
    },
    computed: {
        model: {
            get: function () {

                if (!this.value && this.value !== 0 && this.value !== '0') { return; }

                var result = numeral(this.value).format('0,0.[000]');

                if (this.decimal) {
                    result = result + (this.value.toString().endsWith('.') ? '.' : '');
                    result = result + (this.value.toString().endsWith('.0') ? '.0' : '');
                    result = result + (this.value.toString().endsWith('.00') ? '.00' : '');
                    result = result + (this.value.toString().endsWith('.000') ? '.00' : '');
                }

                return result;

            },
            set: function (newValue) {

                var numVal = numeral(newValue).value();

                if (isNaN(numVal) || numVal > 9007199254740991) {
                    numVal = this.value;
                }

                //alert(numVal)

                var formattedVal = '';

                if (numVal || numVal === 0) {

                    var numValStr = numVal.toString();

                    if (this.decimal && numValStr.indexOf('.') < 0) {
                        numValStr = numValStr + (newValue.endsWith('.') ? '.' : '');
                        numValStr = numValStr + (newValue.endsWith('.0') ? '.0' : '');
                        numValStr = numValStr + (newValue.endsWith('.00') ? '.00' : '');
                        numValStr = numValStr + (newValue.endsWith('.000') ? '.00' : '');
                    }

                    var parts = numValStr.split('.');

                    parts[0] = numeral(parts[0]).format('0,0');

                    if (parts.length >= 2) {

                        numValStr = numValStr.slice(0, numValStr.indexOf('.') + 4);

                        parts[1] = parts[1].toString().slice(0, 3);

                        if (parts.length === 3) {
                            parts.splice(2, 1);
                        }
                    }

                    //formattedValue contains thousand separator & dot ('.')
                    formattedVal = parts.join('.');
                    //numVal only contains dot ('.')
                    numVal = numValStr;
                }

                this.$refs.input.value = formattedVal;

                this.$emit('input', numVal);
            }
        }
    },
    methods: {
        selectAll: function (event) {
            setTimeout(function () {
                event.target.select();
            }, 0);
        }
    }
});