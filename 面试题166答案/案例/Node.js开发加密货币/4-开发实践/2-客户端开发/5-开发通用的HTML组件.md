# 开发通用的HTML组件

## 前言

人的懒惰常常是麻烦的开始。多数程序员都希望自己的工作一劳永逸，一次开发，到处使用，成了人人追逐的目标，我也不例外。最初写《Nodejs开发加密货币》系列文章，因为不喜欢设定好了去写，所以目录反复修改，索性弄了小工具`gitbook-summary`；在写入门文章的时候，反复搜索github，索性把检索与制图集成到一起，弄了个开发语言检索统计工具（见《Node.js让您的前端开发像子弹飞一样》文章实例）；阅读源码的时候，手动整理Uml图很辛苦，干脆写成了js2uml工具（见《轻松从Js文件生成UML类图》文章实例）。这里是另一个例子，不过不是辅助写作的，而是简化web开发的，希望以后用起来方便点，也是懒惰的成果之一。接下来还会有，与本书写作有关，也与亿书项目有关的一个，就是可视化部署（在部署部分介绍）。与这些小工具相比，亿书算作其中相对较大的项目了。这些工具提高了我的工作效率，但也无形中增加了很多工作量。

一个问题的解决，往往孕育着另一个问题的诞生，所以，只要写作和工作不断，与之相关的开发也就不会断。还好，除了个别情况下有点压力，我始终是享受其中的。但是，作为一个完整的有点规模的项目，明确的开发原则和开发路线图，还是必要的。其中一个重要的原则，就是保证每个功能要尽量独立，尽量做到可以重用。这不仅方便项目管理，也方便代码维护，所以，一次开发，处处可用，应该体现在每个环节。这种思想，促使我非常喜欢选择那种，稳固的、约束性较强的软件产品或开发平台，比如ruby on rails, Ember等开发框架。一旦学会，可以让我“一劳永逸”的按照一种思维逻辑去思考和解决遇到的问题。但也有聪明的小伙伴，更喜欢自己具有强大的自主控制权，这样的框架可能就不太适合他。

无论什么样的框架产品，如果一个框架，虽然强大，但是会拒很多现有的工具于门外，必然不会被大家所接受。Ember约束性较强，属于我个人爱好，最初的版本对已有开发包的兼容性较差，但是现在做了很大改进，具备很好的扩展能力，本文就结合`ember-cli-fullpagejs`插件的开发过程，介绍Ember-cli插件开发的各个细节，看看把一个第三方库打包成一个小小的组件是多么简单。

## 插件简介

样式可以浏览亿书官网，http://ebookchain.org，或参考《静态网站开发全景扫描》的截图。

（1）源码

https://github.com/imfly/ember-cli-fullpagejs

（2）使用

安装使用命令

```
$ npm install ember-cli-fullpagejs --save-dev
```

然后，只要在模板文件里，使用标签 `{{#full-page}}{{/full-page}}` 代替 `<div id="fullpage"></div>`即可， 其他与使用 fullPage.js 一样。

**必须的 HTML 结构**

```
{{#full-page}}
    <div
    class="section">Some section</div>
    <div class="section">Some section</div>
    <div class="section">Some section</div>
    <div class="section">Some section</div>
{{/full-page}}
```

为了在一个区域里创建滑块，每个滑块默认使用包含 slide 类的元素：

```
<div class="section">
    <div class="slide"> Slide 1 </div>
    <div class="slide"> Slide 2 </div>
    <div class="slide"> Slide 3 </div>
    <div class="slide"> Slide 4 </div>
</div>
```

**选项**

可以给标签直接添加选项，如:

```html
{{#full-page autoScrolling='true' navigation='true' anchors='["firstPage", "secondPage"]' }}

{{/full-page}}
```

**注意**: 选项值必须使用单引号，而不是双引号。所有选项如下, [更多请参考](https://github.com/alvarotrigo/fullPage.js#options):

## 概念解读

（1）约定优于配置(convention over configuration)

我们在《静态网站开发全景扫描》里简单罗列了Ember的几个注意点，特别提到约定优于配置的问题，这是导致很多小伙伴入手困难的根源。有人很奇怪，这是大家纷纷提倡的，本来是好事，怎么就成了问题了呢？是的，如果习惯了（其实就是记牢了）约定，开发难度会大大降低，效率大大提高，因为框架本身已经帮你做好了这一切。相反，记不住那么多约定，或者你根本就不知道其中有这样的约定，就会给你带来很多困扰。这是目前，我们在学习很多所谓的框架知识的时候，应该特别注意的。这类框架，之所以学习成本较高，一方面是因为规则太多，另一方面就是规则与我们固有的习惯冲突太多。

举个简单的例子，我们在使用第三方库的时候，比如下面例子里的“fullPage.js”，通常要使用<script></script>标签来引入，接着按照该库的逻辑去做就是了。但作为一个约束较强的前端框架，类似的工作，你要先考虑一下，是不是有了它自己的规则。事实上，在Ember框架之下，正确的使用方法是先在`index.js`文件里使用`app.import`引入文件，然后使用组件的生命周期（见参考），通过合适的钩子方法来处理，这里是`didInsertElement()`方法。如果仍然延续原来的做法，最好的情况是得不到任何结果，最差的情况是得出奇怪的结果。

这就给我们使用现有的第三方库造成了很大困难，原本大量现成的好工具，使用起来如此蹩脚。很多小伙伴因此，直接放弃了Ember，转投其他约束较少的框架去了。这里，我们不去衡量框架的优劣，还是直接考虑如何解决这点小问题吧。这个小例子可以帮助我们把现有的库直接改造成Ember可用的插件，让其融入Ember体系，降低绑定难度。因为插件开发的过程，与实际的开发有很多相似的地方，只不过多了一些简单的配置过程，所以我们就把具体的开发过程融入这个插件开发里一起介绍了。当然，这样做不足以介绍Ember的方方面面，至少会解决我认为最困扰我们的地方，降低Ember开发难度。

（2）浏览器世界里的组件

Ember的组件（Component）是非常重要的概念，特别是v2.0.0版本之后，全部取代了视图（View），可以理解为Ember的一切都是组件。一切都是组件的概念，大大简化了问题逻辑，也与浏览器保持了最大兼容性，甚至可以兼容未来的浏览器标准。我个人觉得，Ember团队从此终于走出了ruby on rails的桎梏，开始回归理性，真正面向前端了。毕竟把所有功能集中到一个浏览器页面里（单页面应用），还要硬生生的拉上MVC来，着实让开发者纠结不已。

我们可以把浏览器最原始的按钮、链接、下拉框等标签元素，当成Ember最基本的组件来理解。有了Ember，就可以把一篇文章、一个列表、一个图片展示区域处理成一个组件，这样做至少有三个好处：一是，开发符合MVC的要求，可以做到数据与模板分离，就像开发一个独立的页面一样，思路清晰，快速高效；二是，使用上，这个组件本身与浏览器的基础组件没有区别，非常简单直接，可以自由组合嵌套；三是，一次开发，任何地方都可使用，甚至兼容未来的浏览器。

大家看官方文档，还能看到控制器（Controller）和模型（Model）的概念，其实它们是另类的组件而已，可以理解为组件的扩展。如此以来，使用Ember就简化为浏览器组件的开发，而且使用Ember开发的组件功能也更加强大，使用与浏览器普通的组件没有分别，这样无论开发还是使用都极度简化了。如果再把今天的这个例子弄明白，基本上，我们可以把任何重复性的功能都包装成各种组件，然后打包成插件，需要的时候，直接把这些插件安装上，就可以随处可用了，就又达到了一劳永逸的效果。

## 开发过程

现在，我们就来看看 ember-cli-fullpagejs 的完整开发过程吧。

#### 插件基本情况

（1）场景

Ember CLI插件API，当前支持下面的场景:

* 通过`ember-cli-build.js`操作`EmberApp`（主应用）
* 添加预处理器到默认的注册表
* 提供一个自定义应用程序树与应用程序合并
* 提供定制的专用(服务)中间件
* 添加自定义模板，为主程序生成相关的工程文件

（2）命令行选项

Ember CLI有一个 *addon* 命令，带有下面的选项:

```bash
ember addon <addon-name> <options...>
  Creates a new folder and runs ember init in it.
  --dry-run (Default: false)
  --verbose (Default: false)
  --blueprint (Default: addon)
  --skip-npm (Default: false)
  --skip-bower (Default: false)
  --skip-git (Default: false)
```

注意：一个插件不会在已经存在的应用程序中被创建

（3）创建插件

创建一个基本插件:

`ember addon <addon-name>`

运行该命令，就会产生下面这些文件：

```bash
$ ember addon fullpagejs
version x.y.zz
installing
  create .bowerrc
  create .editorconfig
  create tests/dummy/.jshintrc
  ...
  create index.js

Installing packages for tooling via npm
Installed browser packages via Bower.
```

#### 插件工程结构

通过上述命令，自动生成插件工程目录和相关文件，插件工程遵循这些结构约定:

* `app/` - 合并到应用程序的命名空间(意思是说，在使用该插件的应用程序里，可以直接使用)。
* `addon/` - 插件的命名空间部分。
* `blueprints/` - 包含插件所有蓝图模板文件，每一个存放在一个独立的文件夹里。
* `public/` - 应用程序使用的静态文件，css，images，fonts等，路径前缀 `/your-addon/*`
* `test-support/` - 合并到应用程序的`tests/`
* `tests/` - 测试文件夹，包括一个"dummy"测试应用和验收测试助手。
* `vendor/` - 第三方专有文件，比如stylesheets, fonts, 外部包等等。
* `ember-cli-build.js` - 编译设置。
* `package.json` - Node.js元数据，依赖库等。
* `index.js` - Node.js入口(遵从npm约定)。

（1）Package.json

插件的`package.json`文件，像这样:

```javascript
{
  "name": "ember-cli-fullpagejs", // 插件名称
  "version": "0.0.1", // 插件版本
  "directories": {
    "doc": "doc",
    "test": "test"
  },
  "scripts": {
    "start": "ember server",
    "build": "ember build",
    "test": "ember test"
  },
  "repository": "https://github.com/repo-user/my-addon",
  "engines": {
    "node": ">= 0.10.0"
  },
  "keywords": [
    "ember-addon"
    // 添加更多关键字，便于分类插件
  ],
  "ember-addon": {
    // 插件配置属性
    "configPath": "tests/dummy/config"
  },
  "author": "", // 你的名字
  "license": "MIT", // 协议
  "devDependencies": {
    "body-parser": "^1.2.0",
    ... // 在这里添加专门的依赖库!
  }
}
```

Ember CLI将通过检测每个应用的依赖包的`package.json`文件，看在`keywords`部分是否有`ember-addon`关键字，从而检查一个插件是否存在。我们还可以添加一些额外的元数据来更好地分类该插件:

```javascript
  "keywords": [
    "ember-addon",
    "fullpagejs",
    "fullpage.js"
  ],
```

（2）插件入口

所谓的插件入口，就是调用插件最先执行的文件，每种编程语言都需要。插件将利用npm约定，并寻找一个 `index.js` 文件作为入口点，除非通过`package.json`文件的`"main"`属性指定另一个入口点。建议使用`index.js`作为插件入口点。

产生的`index.js`文件是一个简单的js对象(POJO) ，可以定制和扩展，像这样：

```javascript
// index.js
module.exports = {
  name: 'ember-cli-fullpagejs',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    // 这里你可以修改主应用（app） / 父插件（parentAddon）. 比如, 如果你想包括
    // 一个定制的执行器，你可以把它加到目标注册器，如：
    //     target.registry.add('js', myPreprocessor);
  }
};
```

在构建（build）过程中，included钩子方法会被执行，直接操作主应用程序或者它的父插件，提高插件的处理能力。这个对象扩展了`Addon`类，所以任何存在于`Addon`类的钩子方法都可以被重写。请参考《Ember的几个重要钩子方法简介》

#### 插件开发设计

（1）添加插件依赖

这里，我们把要封装的第三方包`fullpagejs`作为插件的依赖包，打包进插件里去。安装客户端依赖要通过'Bower':

```
bower install --save-dev fullpagejs
```

上述命令，自动添加bower组件到开发依赖

```javascript
// bower.js
{
  "name": "ember-cli-fullpagejs",
  "dependencies": {
    ...
    "fullpage.js": "^2.7.8"
  }
}
```

（2）定制组件

我们要把fullpage.js定制成为一个普通的浏览器组件，希望可以这么使用它：

```html
{{#full-page autoScrolling='true' navigation='true' }}

{{/full-page}}
```

先生成组件，可以使用下面的命令：

```
$ ember generate component full-page
```

组件名称至少有一个“-”线，这是约定，请记住。这个命令会自动生成必要的文件，以及测试文件，只要在里面添加逻辑代码就是了。为了允许应用程序不用手动导入语句而使用插件组件，应该把组件放在应用程序的命名空间之下，即`app/components`目录下，上面的命令已经帮你自动生成，如下：

```javascriptc
// app/components/full-page.js

export { default } from 'ember-cli-fullpagejs/components/full-page';
```

这行代码从插件路径导入组件，再导出到应用程序。实际组件的代码放在`addon/components/full-page.js`里：

```javascript
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  // 这里的选项与fullPage.js包的选项是一致的，请参考：https://github.com/alvarotrigo/fullPage.js#options
  options: {
    //Navigation
    menu: '#menu',
    lockAnchors: false,
    ...
  },

  didRender() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var options = clone(this, this.options);
      Ember.$("#fullpage").fullpage(options);
    });
  },

  willDestroyElement() {
    Ember.$.fn.fullpage.destroy('all');
  }
});
```

Ember的组件渲染之后的标签，默认为`<div></div>`，所以如果需要改为其他的标签，比如span，可以定义tabName属性来重写。didRender()和willDestroyElement()是两个钩子方法，属于组件生命周期的一部分，前者将在组件静态内容全部渲染之后执行，起到了$(document).ready()方法的作用，所以可以确保Ember.$("#fullpage")元素存在的时候执行；后者，将在元素销毁（通常是页面刷新的时候）的时候执行，因为Ember是一个单页面应用，无论你如何跳转或刷新，全局变量Ember.$始终保持，所以必须手动清理。

这里的问题是，为什么使用didRender()，而不是didInsertElement()钩子方法？你看看官方提供的钩子方法文档就知道了，前者在页面初始渲染以及再次渲染（刷新）的时候都可用，而后者仅在初始渲染的时候使用。也就是说，前者可以保证刷新页面，也能保证效果，后者则只能在加载页面时有效果，这也是约定好的。

这里还需要重点解释的是，这个组件也按照“约束优于配置”的原理进行了处理。比如：默认被`{{#full-page }}` 标签包围的代码，会被包裹在`<div id="fullpage"></div>`里，这就避免了用户忘记设置id，而导致出现错误。另外，对选项（options）的处理，默认选项都放在了属性 `options` 之下了，但是我们却可以在使用中去重写，比如 `{{#full-page autoScrolling='true' navigation='true' }}`，这里就使用了ember对组件的一种默认处理，即：写在组件标签里的选项，自动成为该组件对象的属性，因此`autoScrolling`和`navigation`自然就成为`full-page`组件的属性之一，然后我自定义clone方法，把它们重写到`options`就是了。看代码很简单，但却隐含了诸多知识点，也是文档没有直接提供的。

#### 加载第三方库

（1）默认蓝图模板

所谓的蓝图模板，就是我们在安装插件的时候，应该如何把js或css文件加载到主程序，这就好比是第三方库的下载。比如本例，我们在安装插件的使用应该把fullpage.js下载到主程序里。为创建蓝图模板, 添加一个文件 `blueprints/ember-cli-fullpagejs/index.js`，这是标准的Ember蓝图模板的命名约定。

```javascript
module.exports = {
  description: 'ember-cli-fullpagejs',

  normalizeEntityName: function() {
    // allows us to run ember -g ember-cli-fullpagejs and not blow up
    // because ember cli normally expects the format
    // ember generate <entitiyName> <blueprint>
  },

  afterInstall: function(options) {
    return this.addBowerPackageToProject('fullpage.js', '^2.7.8');
  }
};
```

（2）加载库文件

然后，我们就可以把它导入到主应用程序了，需要在`index.js`文件里，使用`included`钩子以正确的顺序导入这些文件，如下：

```javascript
//index.js
module.exports = {
  name: 'ember-cli-fullpagejs',

  included: function included(app) {
    this._super.included(app);

    // workaround for https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    var fullpagejsPath = path.join(app.bowerDirectory, 'fullpage.js/dist');

    app.import(path.join(fullpagejsPath, 'jquery.fullpage.min.css'));
    app.import(path.join(fullpagejsPath, 'jquery.fullpage.min.css.map'), {
      destDir: 'assets'
    });

    app.import(path.join(fullpagejsPath, 'jquery.fullpage.min.js'));
    app.import(path.join(fullpagejsPath, 'jquery.fullpage.min.js.map'), {
      destDir: 'assets'
    });
  }
};
```

这一步就相当于我们平常使用的`<script></script>`标签，不过这里的好处是，可以直接压缩打包进主程序。

（3）导入静态文件

图片、字体等静态文件，通常放在`/public`文件夹里，比如有一张图片，可以保存在 `your-addon/public/images/foo.png`路径下，使用的时候，这样调用：

```
.foo {background: url("/your-addon/images/foo.png");}
```

（4）高级定制

一般来说，如果超越内置或想要/需要更高级的控制，以下是`index.js`里一些插件对象的可用钩子(键)。所有的钩子都希望把一个函数作为它的值（钩子都应该是函数）。

```javascript
includedCommands: function() {},
blueprintsPath: // return path as String
preBuild:
postBuild:
treeFor:
contentFor:
included:
postprocessTree:
serverMiddleware:
lintTree:
```

比如，这里的`contentFor`钩子方法，可以在主程序index.html里，含有`{{content-for "header"}}`标签的地方插入对应内容。

#### 测试插件

插件工程包含一个`/tests` 文件夹，该文件夹包含运行和设置插件测试的基本文件。`/tests` 文件夹有下面的结构:

- `/dummy`
- `/helpers`
- `/unit`
- `index.html`
- `test_helper.js`

`/dummy` 文件夹包含一个基本的dummy应用，用于测试插件。

`/helpers` 文件夹包含各类*qunit*助手，包括为了保持测试简洁，而自定义的。

`/unit` 文件夹包含单元测试，用以测试插件用于各种可用场景。

`integration/` 文件夹包含是集成测试。

`test_helper.js` 是应该在任何测试文件中引用的主要帮助文件，它导入了`resolver`助手，可以在`/helpers`文件夹中找到，用于解析`dummy`中的页面。

`index.html`包含浏览器中加载的测试页面，以显示运行单元测试的结果。

对于如何设置和运行测试，请看官方文档，我们也会用一篇文章专门讲述。

#### 蓝图模板

蓝图模板是一些具有可选安装逻辑的模板文件。它用于根据一些参数和选项生成特定的应用程序文件。一个插件可以有一个或多个蓝图模板。

（1）创建蓝图模板

给插件创建一个*blueprint*:

`ember addon <blueprint-name> --blueprint`

按照惯例，插件的主要蓝图模板应该具有与插件相同的名称:

`ember addon <addon-name> --blueprint`

在我们的例子中，使用命令:

`ember addon fullpagejs --blueprint`

这将为插件产生一个文件夹 `blueprints/ember-cli-fullpagejs`，在这里可以定义蓝图模板的逻辑和模板文件。可以为一个插件定义多个蓝图模板。最后加载的蓝图模板会覆盖现有(同名的)蓝图模板，该模板可以是来自Ember或其他插件(根据包加载顺序)

（2）蓝图模板约定

蓝图模板应该放在插件根目录的`blueprints`文件夹下，就像覆盖工程根目录的蓝图模板一样。如果把它们放在插件的其他目录下，需要通过设置插件的`blueprintsPath`属性告诉ember-cli去哪找到它
(请看下面的 *高级定制* 部分)，如果熟悉 *Yeoman* (或Rails)的产生器，蓝图模板遵从类似的约定和结构。要想更深入的了解蓝图模板设计，请看 [Ember CLI blueprints](https://github.com/stefanpenner/ember-cli/tree/master/blueprints)。

（3）模板文件结构

```bash
blueprints/
  fullpagejs/
    index.js
    files/
      app/
        components/
          __name__/
  unbutton
    index.js
    files/
      config/
        __name__.js
```

注：这里被命名为`__name__` 的特殊文件或文件夹，将（在运行命令时）在主应用程序中产生一个文件/文件夹，并用第一个命令行参数(name)代替`__name__`。

`ember g fullpagejs my-button``

由此在主应用程序中产生一个文件夹`app/components/my-button`。

#### 辅助工具

（1）开发时链接插件

当开发和测试的时候，可以在插件工程的根目录运行`npm link`，这样就可以通过插件名称在本地使用该插件了。然后，在计划使用的应用程序工程根目录，运行`npm link <addon-name>`，就会将插件链接到应用程序的`node_modules`文件夹下，并添加到`package.json`文件。这样，插件中的任何改变都会在链接该插件的任何工程中直接发生作用。

需要注意的是，`npm link`不会像使用安装命令时那样运行默认的蓝图模板（也就是不会调用钩子方法，下载或生成相关的库文件），需要手动使用`ember g`来处理。另外，当我们使用这种链接的方式测试插件的时候，要提供合法的版本信息`"<addon-name>":"version"`，后面的version可以使用`*`代替，而且旧版本的npm可能需要手动添加到`package.json`。

（2）发布插件

使用 *npm* 和 *git* 来发布插件，就像一个标准的npm包。

```bash
npm version 0.0.1
git push origin master
git push origin --tags
npm publish
```

这些命令将被执行：

- 使用版本号标签版本（tag）
- 推送提交的插件代码到版本库(origin branch)
- 推送新标签到版本库(origin branch)
- 发布插件到全局npm库

（3）安装和使用插件

为了在主应用中使用插件，使用下面的命令安装该插件：

`npm install ember-cli-<your-addon-name-here> --save-dev`.

对于我们的 *fullpagejs* 插件，这样使用：

`npm install ember-cli-fullpagejs --save-dev`.

运行 *fullpagejs* 蓝图模板：

`ember generate fullpagejs`

（4）更新插件

可以像更新Ember应用一样，通过在工程根目录运行`ember init`命令，更新一个插件。

## 总结

这篇文章，通过实例详细描述了利用Ember框架，把一个第三方库封装为可以重用的组件的方法（当然，要在Ember框架之下使用），简化了第三方库的使用方法，为我们使用Ember扫除了一个障碍。但是，反过来，这篇文章可能不适合刚入门的小伙伴阅读和使用，因为大量基础知识，需要您去浏览官方文档去补充，然后结合本文，做深层次的思考。

我本人觉得，Ember的目标和代码给了我很大的触动，确实适合做比较综合的大的项目，就像亿书这类应用，大部分功能将被集中到客户端里，所以用Ember开发将非常方便。但是这不代表您也可以选择，所以做自己喜欢、擅长和有价值的事情，才是成功的开端。

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

亿书白皮书： http://ebookchain.org/ebookchain.pdf

亿书官网： http://ebookchain.org

亿书官方QQ群：185046161（亿书完全开源开放，欢迎各界小伙伴参与）

区块链俱乐部公众号：chainclub

## 参考

- [developing addons and blueprints](https://ember-cli.com/extending/#developing-addons-and-blueprints)
- [组件的生命周期](https://guides.emberjs.com/v2.8.0/components/the-component-lifecycle/)
- [fullPage.js](https://github.com/alvarotrigo/fullPage.js)
- [插件的钩子方法（hooks）文档](https://ember-cli.com/api/classes/Addon.html)
