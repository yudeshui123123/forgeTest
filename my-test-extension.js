//扩展程序 代码
function MyTestExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    //绑定卸载清理
    //  this.lockViewport = this.lockViewport.bind(this);
    //  this.unlockViewport = this.unlockViewport.bind(this);
    
           
};
  //扩展程序2 关于点击事件的
function MyTestExtension2(viewer,options){
  Autodesk.Viewing.Extension.call(this, viewer, options);

}
  
  
  MyTestExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
  MyTestExtension.prototype.constructor = MyTestExtension;
  
  MyTestExtension.prototype.load = function() {
    alert('MyTestExtension is loaded!');
    return true;
  };
  
  MyTestExtension.prototype.unload = function() {
    alert('MyTestExtension is now unloaded!');
    return true;
  };
  
  Autodesk.Viewing.theExtensionManager.registerExtension('MyTestExtension', MyTestExtension);

  Autodesk.Viewing.theExtensionManager.registerExtension('MyTestExtension2', MyTestExtension2);

  //加载扩展程序
  var config3d = {
      extensions : ['MyTestExtension','MyTestExtension2', 'ToolbarExtension']
  };
  //将扩展程序加载到viewer中
  viewer.loadExtension('MyTestExtension',MyTestExtension);
  var htmlDiv = document.getElementById("forgeViewer")
  viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv,config3d);
  viewer.start();
  //viewer.loadModel(...);    中文翻译 负荷模型   多模型聚合

   //加载自己的扩展属性  这个名字 在js里定义了 config3d里面
   MyTestExtension.prototype = function(){
    var viewer = this.viewer;  //这个this.viewer 代表的应该是扩展的属性
    var lockBtn = document.getElementById("MyAwesomeLockButton");

    //加载点击事件
    //点击卸载这个事件
    lockBtn.addEventListener("click",function () {
       viewer.setNavigationLock(true); 
    });
    //点击加载这个事件
    var unlockBtn = document.getElementById('MyAwesomeUnlockButton');
    unlockBtn.addEventListener('click', function() {
        viewer.setNavigationLock(false);
    });
    return true;
}

// *********************************************清理卸载  卸载扩展的时候删除添加的点击事件监听器*********************************************

MyTestExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyTestExtension.prototype.constructor = MyTestExtension;

//锁定视图端口
MyTestExtension.prototype.lockViewport = function() {
    this.viewer.setNavigationLock(true);
};
//解锁视图端口
MyTestExtension.prototype.unlockViewport = function() {
    this.viewer.setNavigationLock(false);
};
 
//这个应该是加载扩展属性的时候 将按钮加载上这两个事件  防止清理后，不能再次加载
MyTestExtension.prototype.load = function() {
    this._lockBtn = document.getElementById('MyAwesomeLockButton');
    this._lockBtn.addEventListener('click', this.lockViewport);

    this._unlockBtn = document.getElementById('MyAwesomeUnlockButton');
    this._unlockBtn.addEventListener('click', this.unlockViewport);

    return true;
};

//这个就是删除了
MyTestExtension.prototype.unload = function() {

    if (this._lockBtn) {
        this._lockBtn.removeEventListener('click', this.lockViewport);
        this._lockBtn = null;
    }

    if (this._unlockBtn) {
        this._unlockBtn.removeEventListener('click', this.unlockViewport);
        this._unlockBtn = null;
    }

    return true;
};
// *********************************************清理卸载  改执行的操作结束*********************************************


 //倾听并回应事件
 MyTestExtension2.prototype.onSelectionEvent = function(event) {
  var currSelection = this.viewer.getSelection();
  var domElem = document.getElementById('MySelectionValue');
  domElem.innerText = currSelection.length;
};

MyTestExtension2.prototype.load = function() {
  this.onSelectionBinded = this.onSelectionEvent.bind(this);
  //导航模式事件
  this.onNavigationModeBinded = this.onNavigationModeEvent.bind(this);
  this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
  return true;
};

MyTestExtension2.prototype.unload = function() {
  this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  this.viewer.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
  this.onSelectionBinded = null;
  this.onNavigationModeBinded = null;
  return true;
};
//另一个事件   导航模式事件
MyTestExtension2.prototype.onNavigationModeEvent = function(event) {
  var domElem = document.getElementById('MyToolValue');
  domElem.innerText = event.id;
  //上面等同于
  //domElem.innerText = this.viewer.getActiveNavigationModeTool();
};

  //测试新建 工具栏
  // var test =new Autodesk.Viewing.UI.ToolBar('test',true,true);
  // test.addControl('my-custom-toolbar');

 /******************************************************************************************************************************************************************************************** */ 
//自定义工具栏的 扩展
function ToolbarExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

ToolbarExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ToolbarExtension.prototype.constructor = ToolbarExtension;

//加载事件
ToolbarExtension.prototype.load = function() {

  this.viewer.setLightPreset(6);
  this.viewer.setEnvMapBackground(true);
  this.viewer.fitToView();

  return true;
};
//卸载事件
ToolbarExtension.prototype.unload = function() {
  // nothing yet
};
//将这个扩展注册到视图里
Autodesk.Viewing.theExtensionManager.registerExtension('ToolbarExtension', ToolbarExtension);

//自定义扩展重写基类的onToolbarCreated的方法    添加自定义的工具栏

//创建html按钮
ToolbarExtension.prototype.onToolbarCreated = function(toolbar) {
  alert('TODO: customize Viewer toolbar');
  var viewer = this.viewer;

  // Button 1
  var button1 = new Autodesk.Viewing.UI.Button('show-env-bg-button');
  button1.onClick = function(e) {
      viewer.setEnvMapBackground(true);
  };
  button1.addClass('show-env-bg-button');
  button1.setToolTip('Show Environment');

  // Button 2
  var button2 = new Autodesk.Viewing.UI.Button('hide-env-bg-button');
  button2.onClick = function(e) {
      viewer.setEnvMapBackground(false);
  };
  button2.addClass('hide-env-bg-button');
  button2.setToolTip('Hide Environment');


  // SubToolbar
  this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-toolbar');
  this.subToolbar.addControl(button1);
  this.subToolbar.addControl(button2);

  toolbar.addControl(this.subToolbar);

  //卸载扩展程序时，清理他们的事件和DOM元素
  ToolbarExtension.prototype.unload = function() {
    if (this.subToolbar) {
        this.viewer.toolbar.removeControl(this.subToolbar);
        this.subToolbar = null;
    }
  };

}
//测试
// var aas = new Object();
// aas.ui.exports.Filterbox();
// alert(ass);