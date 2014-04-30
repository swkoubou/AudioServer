// http://motorscript.com/selectize-js-binding-knockout-js/
// Selectize.js binding for Knockout.js
// Posted on February 5, 2014, last updated on February 8, 2014 by Dipesh Acharya

// Modified by s.nakazawa

var inject_binding = function (allBindings, key, value){
    //https://github.com/knockout/knockout/pull/932#issuecomment-26547528
    return {
        has: function (bindingKey) {
            return (bindingKey == key) || allBindings.has(bindingKey);
        },
        get: function (bindingKey) {
            var binding = allBindings.get(bindingKey);
            if (bindingKey == key) {
                binding = binding ? [].concat(binding, value) : value;
            }
            return binding;
        }
    };
};

ko.bindingHandlers.selectize = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        if (!allBindingsAccessor.has('optionsText'))
            allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsText', 'name');
        if (!allBindingsAccessor.has('optionsValue'))
            allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsValue', 'id');
        if (typeof allBindingsAccessor.get('optionsCaption') == 'undefined')
            allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsCaption', 'Choose...');
        if (!allBindingsAccessor.has('optionCreate') || !_.isObject(allBindingsAccessor.get('optionCreate')))
            allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsCreate', false);

        ko.bindingHandlers.options.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

        var $select,
            options_create = allBindingsAccessor.get('optionsCreate')[0],
            original_object = _.isFunction(options_create) ? options_create() : options_create;
            options = {
            valueField: allBindingsAccessor.get('optionsValue'),
            labelField: allBindingsAccessor.get('optionsText'),
            searchField: allBindingsAccessor.get('optionsText'),
            create: allBindingsAccessor.get('optionsCreate') != false,
            onOptionAdd: function (value, data) { // on create
                if (!original_object) {
                    return;
                }

                // 自動的に作成されたオプションを削除
                this.removeOption(value);

                // 指定されたオブジェクトの更新
                original_object.name(value);

                // 追加したのを選択
                this.setValue(original_object.id);
            }
        };

        $select = $(element).selectize(options)[0].selectize;
        $select.addItem(allBindingsAccessor.get('value')());

        if (typeof init_selectize == 'function') {
            init_selectize($select);
        }

        // オリジナルにバインド
        if (ko.isObservable(original_object.name)) {
            original_object.name.subscribe(function () {
                $select.updateOption(original_object.id, {
                    id: original_object.id,
                    name: _.isFunction(original_object.name) ? original_object.name() : original_object.name
                });
            });
        }

        // バインドオブジェクトにバインド
        valueAccessor().subscribe(function (new_value) {
            var new_obj;

            if (ko.isComputed(valueAccessor())) {
                // 既にある場合は更新
                _.each(new_value, function (x) {
                    if (_.some($select.options, function (y) { return y.id == x.id; })) {
                        $select.updateOption(x.id, {
                            id: x.id,
                            name: _.isFunction(x.name) ? x.name() : x.name
                        });
                    }else {
                        $select.addOption(x);
                    }
                });
            } else {
                // 無い場合は追加
                new_obj = new_value[new_value.length - 1];
                $select.addOption(new_obj);
            }
        });

        // ユーザ名のリンク
        $select.addItem(allBindingsAccessor.get('value').subscribe(function (new_value) {
            if (_.some(valueAccessor()(), function (x) {
                return x.id == new_value;
            }) && $select.getValue() != new_value) {
                $select.setValue(new_value);
            }
        }));

    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if (allBindingsAccessor.has('object')) {
            var value_accessor = valueAccessor();
            var selected_obj = $.grep(value_accessor(), function (i) {
                return i.id == allBindingsAccessor.get('value')();
            })[0];

            if (selected_obj) {
                allBindingsAccessor.get('object')(selected_obj);
            }
        }
    }
};