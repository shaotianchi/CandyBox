var com = com || {};
var distance = 50;

com.rainbow = {
    configsPage: undefined,
    configsLayer: undefined,
    configsColors: undefined,
    configs: undefined,
    context: undefined,
    document: undefined,
    selection: undefined,
    pages: undefined,
    page: undefined,
    artboard: undefined,
    current: undefined,
    styles: undefined,
    isPercentage: false,
    init: function(context){
        this.context = context;
        this.document = context.document;
        this.selection = context.selection;
        this.pages = this.document.pages();
        this.page = this.document.currentPage();
        this.artboard = this.page.currentArtboard();
        this.current = this.artboard || this.page;
    },
    extend: function( options, target ){
        var target = target || this;

        for ( var key in options ){
            target[key] = options[key];
        }
        return target;
    },
    is: function(layer, theClass){
        if(!layer) return false;
        var klass = layer.class();
        return klass === theClass;
    },
    isIntersect: function(lf, tf){
        return !(
            lf.maxX <= tf.x ||
            lf.x >= tf.maxX ||
            lf.y >= tf.maxY ||
            lf.maxY <= tf.y
        );
    },
    getFrame: function(layer) {
        var rect = layer.absoluteRect();
        return {
            x: Math.round(rect.x()),
            y: Math.round(rect.y()),
            width: Math.round(rect.width()),
            height: Math.round(rect.height()),
            maxX: Math.round(rect.x() + rect.width()),
            maxY: Math.round(rect.y() + rect.height())
        };
    },
    getRainbowFrame: function(layer) {
        var rect = layer.absoluteRect();
        return {
            left: Math.round(rect.x()),
            right: Math.round(rect.x() + rect.width()),
            top: Math.round(rect.y()),
            bottom: Math.round(rect.y() + rect.height()),
            width: Math.round(rect.width()),
            height: Math.round(rect.height())
        }
    },
    getDistance: function(frame, target){
        var tf = target || this.getFrame(this.current);

        return [
            ( frame.y - tf.y ),
            ( (tf.x + tf.width) - frame.maxX ),
            ( (tf.y + tf.height) - frame.maxY ),
            ( frame.x - tf.x )
        ];
    },
    addLayer: function(type, container){
        var container = container || this.current;
        return container.addLayerOfType(type);
    },
    addGroup: function(container){
        var container = container || this.current;
        return this.addLayer("group", container);
    },
    addShape: function(container){
        var container = container || this.curreent;
        return this.addLayer("rectangle", container);
    },
    addText: function(container){
        var container = container || this.current;
        return this.addLayer("text", container);
    },
    removeLayer: function(layer){
        var container = layer.parentGroup();
        if (container) container.removeLayer(layer);
    },
    message: function(message){
        this.document.showMessage(message);
    }
};

//Functions
com.rainbow.extend({
    generate: function() {
        var alert = NSAlert.alloc().init();
        alert.setMessageText('Alert Title');
        alert.setInformativeText('Alert Text');
        alert.addButtonWithTitle('OK');
        alert.addButtonWithTitle('Cancel');

        var nibui = new NibUI(this.context,
            'UIBundle', 'ConstraintSettingView',
            ['topConstraintTextField', 'bottomConstraintTextField', 'leftConstraintTextField', 'rightConstraintTextField',
            'widthConstraintCheck' ,'widthConstraintTextField', 'heightConstraintCheck', 'heightConstraintTextField',
            'horizontalConstraintCheck', 'horizontalConstraintTextField', 'verticalConstraintCheck', 'verticalConstraintTextField']);

        alert.setAccessoryView(nibui.view);
        alert.runModal();
        nibui.destroy();
    }
});

//Find
com.rainbow.extend({
    find: function(name, container, isArray, field){
        var field = field || "name";
        var predicate = NSPredicate.predicateWithFormat("(" + field + " != NULL) && (" + field + " == %@)", name);
        var container = container || this.current;
        var items;
        if(isArray){
            items = container;
        }
        else{
            items = container.children();
        }
        var queryResult = items.filteredArrayUsingPredicate(predicate);

        if (queryResult.count()==1){
            return queryResult[0];
        } else if (queryResult.count()>0){
            return queryResult;
        } else {
            return false;
        }
    }
});

com.rainbow.extend({
    pageFrame: function(){
        var viewSize = this.document.currentView().frame().size;
        var pageOrigin = this.document.scrollOrigin();
        var scale = this.document.zoomValue();
        return {
            x: -pageOrigin.x / scale,
            y: -pageOrigin.y / scale,
            width: viewSize.width,
            height: viewSize.height
        }
    }
});