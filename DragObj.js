(
    function ()
    {
        window.$j.DragObj = function CreateDragObj(contentElement, width, height)
        {
            return new DragObj(contentElement, width, height);
        }

        function DragObj(contentElement, left, top, width, height)
        {
            if (left)
                this.left = left;
            else
                this.left = "200px";

            if (top)
                this.top = top;
            else
                this.top = "100px";

            if (width)
                this.width = width;
            else
                this.width = "200px";

            if (height)
                this.height = height;
            else
                this.height = "150px";


            var elemt = document.createElement("div");

            elemt.style.position = "absolute";
            elemt.style.top = this.top;
            elemt.style.left = this.left;
            elemt.style.width = this.width;
            elemt.style.height = this.height;


            var ctrl = this;

            elemt.addEventListener("mousedown",
                function ()
                {
                    draggingDiv_mousedown(ctrl);
                });

            elemt.addEventListener("mousemove",
                function ()
                {
                    div_mousemoveForResize(ctrl);
                });

            this.elemt = elemt;

            elemt.appendChild(contentElement);

            this.contentElement = contentElement;

        }


        var _isInit = false;
        var _txtFocusForNoSelection = null;
        var _draggingDiv = null;
        var _offX = 0;
        var _offY = 0;
        var _defaultZIndex = 50;
        var _draggingZIndex = 100;

        var _resizingDiv = null;

        
        function draggingDiv_mousedown( ctrl )
        {

            var e = window.event;

            var div = ctrl.elemt;

            //  �ж�����Ƿ��� div ��Ե�ɵ�����С��λ�á� 
            //  ����� div �� mousemove �¼�����жϣ������п�����һ������������С�����δ�ƶ��ּ����������ʱӦ���ܼ���������С��
            //  ������Ҫ�� ��� ��� ʱҲ�ж�����Ƿ��� div ��Ե�ɵ�����С��λ��
            div_mousemoveForResize(ctrl);


            if (div.canResize)
            {
                div.resizeOriginalOffsetWidth = div.offsetWidth;
                div.resizeOriginalOffsetHeight = div.offsetHeight;
                div.resizeOriginalOffsetLeft = div.offsetLeft;
                div.resizeOriginalOffsetTop = div.offsetTop;
                div.resizeMouseOriginalX = e.clientX;
                div.resizeMouseOriginalY = e.clientY;

                _resizingDiv = div;

                window.addEventListener("mousemove", window_mousemoveForResize);
                window.addEventListener("mouseup", window_mouseupForResize);

                document.documentElement.setAttribute("onselectstart", "return false;");

                return;
            }


            if (_draggingDiv != null)
                _draggingDiv.style.zIndex = _defaultZIndex;

            div.style.zIndex = _draggingZIndex;

            _draggingDiv = div;
            
            _offX = e.clientX - div.offsetLeft;
            _offY = e.clientY - div.offsetTop;

            window.addEventListener("mouseup", window_mouseup);
            window.addEventListener("mousemove", window_mousemove);// = new Function("body_mousemove(event);");

            document.documentElement.setAttribute("onselectstart", "return false;");
        }

        function window_mouseup() {

            window.removeEventListener("mouseup", window_mouseup);
            window.removeEventListener("mousemove", window_mousemove);// = new Function("body_mousemove(event);");

            document.documentElement.removeAttribute("onselectstart");
        }

        function window_mousemove() {
            
            if (_draggingDiv == null)
                return;

            var e = window.event;
            var div = _draggingDiv;

            div.style.position = "absolute";
            div.style.top = (e.clientY - _offY) + "px";
            div.style.left = (e.clientX - _offX) + "px";
        }

        function window_mouseupForResize()
        {
            var div = _resizingDiv;

            div.canResize = false;
            div.resizeOrientation = "";

            _resizingDiv = null;

            window.removeEventListener("mousemove", window_mousemoveForResize);
            window.removeEventListener("mouseup", window_mouseupForResize);

            document.documentElement.removeAttribute("onselectstart");

            console.info("window_mouseupForResize end");
        }

        function window_mousemoveForResize()
        {

            var div = _resizingDiv;

            var e = window.event;

            if (div.resizeOrientation == "RightBottom") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "LeftTop") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "LeftBottom") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                //div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "RightTop") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                //div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "Left") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
            }
            else if (div.resizeOrientation == "Right") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
            }
            else if (div.resizeOrientation == "Top") {
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "Bottom") {
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }

        }

        function div_mousemoveForResize(ctrl)
        {

            if (_resizingDiv != null)
                return;

            var div = ctrl.elemt;

            var e = window.event;

            if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)
                && e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1)) {
                div.style.cursor = "se-resize";
                div.canResize = true;
                div.resizeOrientation = "RightBottom";
            }
            else if (e.offsetX >= 1 && e.offsetX <= 10
                && e.offsetY >= 1 && e.offsetY <= 10) {
                div.style.cursor = "nw-resize";
                div.canResize = true;
                div.resizeOrientation = "LeftTop";
            }
            else if (e.offsetX >= 1 && e.offsetX <= 10
                && e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1)) {
                div.style.cursor = "sw-resize";
                div.canResize = true;
                div.resizeOrientation = "LeftBottom";
            }
            else if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)
                && e.offsetY >= 1 && e.offsetY <= 10) {
                div.style.cursor = "ne-resize";
                div.canResize = true;
                div.resizeOrientation = "RightTop";
            }
            else if (e.offsetX >= 1 && e.offsetX <= 10) {
                div.style.cursor = "w-resize";
                div.canResize = true;
                div.resizeOrientation = "Left";
            }
            else if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)) {
                div.style.cursor = "e-resize";
                div.canResize = true;
                div.resizeOrientation = "Right";
            }
            else if (e.offsetY >= 1 && e.offsetY <= 10) {
                div.style.cursor = "n-resize";
                div.canResize = true;
                div.resizeOrientation = "Top";
            }
            else if (e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1)) {
                div.style.cursor = "s-resize";
                div.canResize = true;
                div.resizeOrientation = "Bottom";
            }
            else {
                div.style.cursor = "";
                div.canResize = false;
                div.resizeOrientation = "";
            }

        }

        DragObj.prototype.Show = function Show()
        {
            document.documentElement.appendChild(this.elemt);
        }
    }
)();