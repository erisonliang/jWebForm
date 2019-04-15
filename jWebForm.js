document.documentElement.setAttribute("ondragstart", "return false;");

window.addEventListener("load", jwf$window_load);
window.addEventListener("mousedown", jwf$window_mousedown);

/* �ⲿ���� Ϊ�˽�� window mousedown �¼� �� iframe �� �������� �� ����
   iframe ��һ�� ������ window �� ��� iframe ����ֻ�ᴥ�� iframe �����Լ��� mousedown �¼�
   �����͵��� ������ �� DropDown DropDownList DropMenu �� �ؼ� �������� window mousedown �¼� �ر� ������ �����˵�
   ʹ�÷��� �ǣ�

    1 jWebForm �ؼ� ʹ�� jwf$AddEventHandler_To_Frames_Window_MouseDown(handler) ���� �� ��� window mousedown �¼� 
      ���� window.addEventListener("mousedown", function xxx());

    2 ������Ա Ӧ���� �� $j.Frame_Window_MouseDown ��ӵ� iframe �� window mousedown �¼������£�

      var ifr = document.getElementById("ifr");
      ifr.contentWindow.addEventListener("mousedown", $j.Frame_Window_MouseDown);

    ��Ȼ���� 2 �� ���Ǳ���ģ�������� �� 2 ������ô��jWebForm �Ͳ�֪�� ��� iframe ���¼�������
    ���µ�Ч������ ���� ��� iframe ʱ ������ ��� DropDown DropDownList DropMenu �� ������ �����˵� ����ر�
    ��Ȼ�ⲻһ�������⣬��ʱ��������Ч��Ҳ�ǿ��Խ��ܵģ�������ʱ��Ҫ�ľ�������Ч���� ^^

   �ƶ���֮�����һ��ҳ���а������ iframe�� iframe Ҳ��Ƕ�ף���ôҲ����������������
   ���ǰ� ������ �� iframe ��������һ�� frame��
   ����һ�� ҳ�� ���� n �� frame��
   ������Ա �� A frame ��ʹ���� jWebForm �ؼ���
   �����ѡ�� A frame �� $j.Frame_Window_MouseDown ��ӵ� ����������� frame �� window mousedown �¼���
   �� B frame �� C frame ���� �� ʹ���� jWebForm �ؼ���Ȼ���������ơ�
   ����ͬʱ�ڶ�� frame ��ͬʱʹ�� jWebForm �ؼ���
*/
var jwf$window_mousedown$handlers = [];

function jwf$window_mousedown()
{
    for (var i = 0; i < jwf$window_mousedown$handlers.length; i++)
    {
        var handler = jwf$window_mousedown$handlers[i];

        handler();
    }
}

function jwf$AddEventHandler_To_Frames_Window_MouseDown(handler)
{
    jwf$window_mousedown$handlers[jwf$window_mousedown$handlers.length] = handler;
}

$j.Frame_Window_MouseDown = jwf$window_mousedown;
/*  *****************************************  */

var jwf$controls = new Object();

function $j(id)
{
    return jwf$controls[id];
}

function jwf$window_load()
{
    jwf$InitControls();

    if ($j.Page_Load)
    {
        $j.Page_Load();
    }
}

function jwf$InitControls() {
    var jelemts = [];

    jwf$GetJwfElements(jelemts, document.body);

    for (var i = 0; i < jelemts.length; i++)
    {
        var jelemt = jelemts[i];

        var ctrl = jwf$GetControl(jelemt);

        var id = jelemt.getAttribute("id");

        if (id)
        {
            jwf$RegiterControl(ctrl, id);
        }

        jelemt.parentNode.replaceChild(ctrl.elemt, jelemt);

    }
}

// ��Ϊ document  document.documentElement  document.body �� getElementsByTagNameNS() �����������ã�
// ���� �ռ��ϣ�����ֻ�ܵݹ���������� jWebForm��j:�� Ԫ�ء�
function jwf$GetJwfElements(elemts, elemt) {
    var s = elemt.nodeName.substring(0, 2);
    if (elemt.nodeName.substring(0, 2) == "J:") {
        elemts[elemts.length] = elemt;
    }

    if (elemt.childNodes.length == 0)
        return;

    for (var i = 0; i < elemt.childNodes.length; i++) {
        var childNode = elemt.childNodes[i];

        jwf$GetJwfElements(elemts, childNode);
    }
}

function jwf$RegiterControl(ctrl, id)
{
    ctrl.id = id;
    ctrl.elemt.id = id;

    jwf$controls[id] = ctrl;
}

var jwf$ControlTypes =
{
    //"J:DROPDOWNLIST": jwf$DropDownList,
    //"J:PICTUREBOX": jwf$PictureBox,
    //"J:BUTTON": jwf$Button,
    //"J:DROPMENU": jwf$DropMenu
};

function jwf$GetControl(jelemt)
{
    var ctor = jwf$ControlTypes[jelemt.nodeName];

    if (!ctor)
        throw "��Ч�� nodeName ��\"" + jelemt.nodeName + "\" ��";

    return new ctor(jelemt);

    //if (jelemt.nodeName == "J:DROPDOWNLIST")
    //{
    //    return new jwf$DropDownList(jelemt);
    //}
    //else if (jelemt.nodeName == "J:PICTUREBOX")
    //{
    //    return new jwf$PictureBox(jelemt);
    //}
    //else if (jelemt.nodeName == "J:BUTTON")
    //{
    //    return new jwf$Button(jelemt);
    //}
    //else if (jelemt.nodeName == "J:DROPMENU")
    //{
    //    return new jwf$DropMenu(jelemt);
    //}

    //throw "��Ч�� nodeName ��\"" + jelemt.nodeName + "\" ��";
}

function jwf$Control()
{
    
}

jwf$Control.prototype.Element = function jwf$Control$Element()
{
    return this.elemt;
}


