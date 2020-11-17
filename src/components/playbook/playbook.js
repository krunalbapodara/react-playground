import React, { Component } from "react";
import $ from "jquery";
import { Row, Col, Button, Tabs, Input, Collapse } from "antd";
import { PlaybookWindow, PlaybookBox, TaskBox, SingleTask } from "./styles";
import { automation } from "./data";
import TaskModal from "./taskModal";
import "./playbook.css";

const { TabPane } = Tabs;
const { Search } = Input;
const { Panel } = Collapse;

class Playbook extends Component {
  boxes2 = [];
  shapes = [
    {
      x: 500,
      y: 100,
      w: 300,
      h: 50,
      fill: "#5f7599",
      type: "rect",
      id: "rect0",
      task: "main",
      text: "Playbook Triggered",
      subText: "Input / Output"
    }
  ];
  connectors = [];
  selectionHandles = [];

  canvas;
  ctx;
  WIDTH;
  HEIGHT;
  INTERVAL = 20;

  isDrag = false;
  isResizeDrag = false;
  newConnector = false;
  expectResize = -1;
  mx;
  my;
  oldx;
  oldy;
  style = {};

  canvasValid = false;

  mySel = null;

  mySelColor = "#CC0000";
  mySelWidth = 2;
  mySelBoxColor = "darkred";
  mySelBoxSize = 6;

  ghostcanvas;
  gctx;

  offsetx;
  offsety;

  stylePaddingLeft;
  stylePaddingTop;
  styleBorderLeft;
  styleBorderTop;

  componentDidMount() {
    this.init2();
  }

  init2 = () => {
    this.canvas = document.getElementById("canvas2");
    this.canvas.height =
      $("#container2").height() - $("#btnControlRow").height();
    this.canvas.width = $("#container2").width() - 5;

    this.HEIGHT = this.canvas.height;
    this.WIDTH = this.canvas.width;

    this.ctx = this.canvas.getContext("2d");

    this.ghostcanvas = document.createElement("canvas");

    this.ghostcanvas.height = this.HEIGHT;
    this.ghostcanvas.width = this.WIDTH;

    this.gctx = this.ghostcanvas.getContext("2d");

    //fixes a problem where double clicking causes text to get selected on the canvas
    this.canvas.onselectstart = function() {
      return false;
    };

    // fixes mouse co-ordinate problems when there's a border or padding
    // see getMouse for more detail
    if (document.defaultView && document.defaultView.getComputedStyle) {
      this.stylePaddingLeft =
        parseInt(
          document.defaultView.getComputedStyle(this.canvas, null)[
            "paddingLeft"
          ],
          10
        ) || 0;
      this.stylePaddingTop =
        parseInt(
          document.defaultView.getComputedStyle(this.canvas, null)[
            "paddingTop"
          ],
          10
        ) || 0;
      this.styleBorderLeft =
        parseInt(
          document.defaultView.getComputedStyle(this.canvas, null)[
            "borderLeftWidth"
          ],
          10
        ) || 0;
      this.styleBorderTop =
        parseInt(
          document.defaultView.getComputedStyle(this.canvas, null)[
            "borderTopWidth"
          ],
          10
        ) || 0;
    }

    // make mainDraw() fire every INTERVAL milliseconds
    setInterval(() => {
      this.mainDraw();
    }, this.INTERVAL);

    // set our events. Up and down are for dragging,
    // double click is for making new boxes
    // this.canvas.addEventListener("click", this.isInside(), false);
    this.canvas.onmousedown = this.myDown;
    this.canvas.onmouseup = this.myUp;
    // this.canvas.onclick = this.isInside;
    this.canvas.onmousemove = this.myMove;

    // set up the selection handle boxes
    for (let i = 0; i < 8; i++) {
      var rect = new Box2();
      this.selectionHandles.push(rect);
    }

    // add custom initialization here:
    for (var i = 0; i < this.shapes.length; i++) {
      this.addRect(this.shapes[i]);
    }

    for (let i = 0; i < this.connectors.length; i++) {
      let connector = this.connectors[i].split("-");
      let s1 = this.shapes.filter(shape => shape.id === connector[0]);
      let s2 = this.shapes.filter(shape => shape.id === connector[1]);
      this.addConnector(s1[0], s2[0]);
    }
  };

  clear = c => {
    c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  };

  invalidate = () => {
    this.canvasValid = false;
  };

  mainDraw = () => {
    if (this.canvasValid === false) {
      this.clear(this.ctx);

      // Add stuff you want drawn in the background all the time here

      // draw all boxes
      var l = this.boxes2.length;
      for (let i = 0; i < l; i++) {
        this.boxes2[i].draw(this.ctx); // we used to call drawshape, but now each box draws itself
      }

      // Add stuff you want drawn on top all the time here

      this.canvasValid = true;
    }
  };

  myMove = e => {
    if (this.isDrag) {
      this.getMouse(e);

      this.mySel.shape.x = this.mx - this.offsetx;
      this.mySel.shape.y = this.my - this.offsety;

      let xxx = this.connectors.filter(s => s.includes(this.mySel.shape.id));
      for (let ix = 0; ix < xxx.length; ix++) {
        let line = this.boxes2.filter(s => s.shape.id === xxx[ix]);

        let lineId = line[0].shape.id.split("-");

        let box1 = this.boxes2.filter(s => s.shape.id === lineId[0])[0].shape;
        let box2 = this.boxes2.filter(s => s.shape.id === lineId[1])[0].shape;
        //first end of line
        line[0].shape.y = box1.y + box1.h + 10;
        line[0].shape.x = box1.x + box1.w / 2 + 7;
        //second end of line
        line[0].shape.y2 = box2.y - 10;
        line[0].shape.x2 = box2.x + box2.w / 2 + 7;
      }

      // something is changing position so we better invalidate the canvas!
      this.invalidate();
    } else if (this.isResizeDrag) {
      // time ro resize!
      let oldx = this.mySel.shape.x;
      let oldy = this.mySel.shape.y;

      // 0  1  2
      // 3     4
      // 5  6  7
      switch (this.expectResize) {
        case 0:
          this.mySel.shape.x = this.mx;
          this.mySel.shape.y = this.my;
          this.mySel.shape.w += oldx - this.mx;
          this.mySel.shape.h += oldy - this.my;
          break;
        case 1:
          this.mySel.shape.y = this.my;
          this.mySel.shape.h += oldy - this.my;
          break;
        case 2:
          this.mySel.shape.y = this.my;
          this.mySel.shape.w = this.mx - oldx;
          this.mySel.shape.h += oldy - this.my;
          break;
        case 3:
          this.mySel.shape.x = this.mx;
          this.mySel.shape.w += oldx - this.mx;
          break;
        case 4:
          this.mySel.shape.w = this.mx - oldx;
          break;
        case 5:
          this.mySel.shape.x = this.mx;
          this.mySel.shape.w += oldx - this.mx;
          this.mySel.shape.h = this.my - oldy;
          break;
        case 6:
          this.mySel.shape.h = this.my - oldy;
          break;
        case 7:
          this.mySel.shape.w = this.mx - oldx;
          this.mySel.shape.h = this.my - oldy;
          break;
        default: {
        }
      }
      this.invalidate();
    } else if (this.newConnector === true) {
      this.getMouse(e);
      this.mySel.shape.x2=this.mx;
      this.mySel.shape.y2=this.my;
      this.invalidate();
    }
  };

  myDown = e => {
    this.getMouse(e);
    this.oldx = this.mx;
    this.oldy = this.my;
    //we are over a selection box
    if (this.expectResize !== -1) {
      this.isResizeDrag = true;
      return;
    }

    this.clear(this.gctx);
    let l = this.boxes2.length;
    for (let i = l - 1; i >= 0; i--) {
      // draw shape onto ghost context
      this.boxes2[i].draw(this.gctx, "black");
      // get image data at the mouse x,y pixel
      let imageData = this.gctx.getImageData(this.mx, this.my, 1, 1);
      //let index = (mx + my * imageData.width) * 4;

      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        this.mySel = this.boxes2[i];
        this.offsetx = this.mx - this.mySel.shape.x;
        this.offsety = this.my - this.mySel.shape.y;
        this.mySel.shape.x = this.mx - this.offsetx;
        this.mySel.shape.y = this.my - this.offsety;

        let x = this.mySel.shape.x + this.mySel.shape.w / 2 + 5;
        let y = this.mySel.shape.y + this.mySel.shape.h;
        if (
          x - 6 < this.mx &&
          this.mx < x + 10 &&
          y < this.my &&
          y + 9 > this.my
        ) {
          this.addConnector(this.mySel.shape, this.mySel.shape, "newLine");
        } else {
          this.isDrag = true;
        }
        this.invalidate();
        this.clear(this.gctx);
        return;
      }
    }
    // havent returned means we have selected nothing
    this.mySel = null;
    // invalidate because we might need the selection border to disappear
    this.invalidate();
    // clear the ghost canvas for next time
    this.clear(this.gctx);
  };

  myUp = () => {
    this.isDrag = false;
    this.isResizeDrag = false;
    this.expectResize = -1;
    if (this.newConnector === true) {
      let l = this.boxes2.length;
      for (let i = l - 1; i >= 0; i--) {
        this.boxes2[i].draw(this.gctx, "black");
        let imageData = this.gctx.getImageData(this.mx, this.my, 1, 1);
        if (imageData.data[3] > 0) {
          let x = this.boxes2[i].shape.x + this.boxes2[i].shape.w / 2 + 5;
          let y = this.boxes2[i].shape.y;
          if (
            x - 6 < this.mx &&
            this.mx < x + 10 &&
            y > this.my &&
            y - 8 < this.my
          ) {
            this.mySel.shape.id = this.mySel.shape.id + this.boxes2[i].shape.id;
            this.mySel.shape.x2 =
              this.boxes2[i].shape.x + this.boxes2[i].shape.w / 2 + 7;
            this.mySel.shape.y2 = this.boxes2[i].shape.y - 10;
            this.connectors.push(this.mySel.shape.id);
            this.mySel = null;
            this.newConnector = false;
            this.invalidate();
            this.clear(this.gctx);
            return;
          } else {
            let c = this.boxes2.indexOf(this.mySel);
            this.boxes2.splice(c, 1);
            this.newConnector = false;
            this.invalidate();
            this.clear(this.gctx);
            return;
          }
        }
      }
      let c = this.boxes2.indexOf(this.mySel);
      this.boxes2.splice(c, 1);
      this.newConnector = false;
      this.invalidate();
      this.clear(this.gctx);
    } else if (this.oldx === this.mx && this.oldy === this.my) {
      let l = this.boxes2.length;
      for (let i = l - 1; i >= 0; i--) {
        this.boxes2[i].draw(this.gctx, "black");
        let imageData = this.gctx.getImageData(this.mx, this.my, 1, 1);
        if (imageData.data[3] > 0) {
          this.mySel = this.boxes2[i];
          let x = this.mySel.shape.x + this.mySel.shape.w - 42;
          let y = this.mySel.shape.y + 15;
          if (
            this.mx > x &&
            this.mx < x + 30 &&
            this.my < y + 10 &&
            this.my > y
          ) {
            let ii = this.boxes2.findIndex(
              s => s.shape.id === this.mySel.shape.id
            );
            let xxx = this.connectors.filter(s =>
              s.includes(this.mySel.shape.id)
            );
            for (let ix = 0; ix < xxx.length; ix++) {
              let xc = this.connectors.findIndex(s => s === xxx[ix]);
              let xcc = this.boxes2.findIndex(s => s.shape.id === xxx[ix]);
              this.boxes2.splice(xcc, 1);
              this.connectors.splice(xc, 1);
            }
            this.boxes2.splice(ii, 1);
            this.mySel = null;
            this.invalidate();
            this.clear(this.gctx);
            return;
          }
        }
      }
      this.mySel = null;
      this.invalidate();
      this.clear(this.gctx);
    }
  };

  getMouse = e => {
    let element = this.canvas,
      offsetX = 0,
      offsetY = 0;
    if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    offsetX += this.stylePaddingLeft;
    offsetY += this.stylePaddingTop;

    offsetX += this.styleBorderLeft;
    offsetY += this.styleBorderTop;

    this.mx = e.pageX - offsetX;
    this.my = e.pageY - offsetY;
  };

  addRect = (...rest) => {
    const { x, y, w, h, fill, type, task, text, subText } = rest[0];
    let rect = {};
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
    rect.type = type;
    rect.fill = fill;
    rect.id = type + this.boxes2.length;
    rect.task = task;
    rect.text = text;
    rect.subText = subText;
    let recti = new Box2(rect);
    this.boxes2.push(recti);
    this.invalidate();
  };

  addConnector = (box1, box2, type) => {
    let line = {};
    line.y = box1.y + box1.h + 10;
    line.y2 = box2.y - 10;
    line.x = box1.x + box1.w / 2 + 7;
    line.x2 = box2.x + box2.w / 2 + 7;
    line.h = box1.type === "circle" ? box1.r : box1.h;
    line.h2 = box2.type === "circle" ? box2.r : box2.h;
    line.w = box1.type === "circle" ? box1.r : box1.w;
    line.w2 = box2.type === "circle" ? box2.r : box2.w;
    line.type = "line";
    line.id = box1.id + "-" + box2.id;
    if (type) {
      line.id = box1.id + "-";
      line.y2 = box1.y + box1.h + 5;
    }
    let lines = new Box2(line);
    this.boxes2.push(lines);
    if (type) {
      this.mySel = lines;
      this.newConnector = true;
    }
    this.invalidate();
  };

  addShape = rest => {
    const { type, text, task } = rest;
    let linesCount = this.boxes2.filter(s => s.shape.id === "line");
    let totalCount = this.boxes2.length - linesCount.length;
    // for this method width and height determine the starting X and Y, too.
    // so I left them as vars in case someone wanted to make them args for something and copy this code
    if (type === "rect") {
      this.addRect({
        x: 600,
        y: 320,
        w: 300,
        h: task === "main" ? 50 : 80,
        fill: task === "main" ? "#5f7599" : "#fff",
        type: "rect",
        task: task,
        text: text,
        subText: totalCount
      });
    }
  };
  ///Canvas functionality over

  ///component starts
  state = {
    taskModal: false,
    modalType: "new",
    task: null,
    taskLibrary: false
  };

  toggleTaskLibrary = () => {
    this.setState({ taskLibrary: !this.state.taskLibrary });
  };

  taskModal = (type, data) => {
    this.setState({ taskModal: true, modalType: type });
    if (data) {
      this.setState({ task: data });
    }
  };

  addTask = () => {};

  closeModal = () => {
    this.setState({ taskModal: false, modalType: "new", task: null });
  };

  render() {
    return (
      <PlaybookWindow>
        <TaskModal
          taskModal={this.state.taskModal}
          modalType={this.state.modalType}
          task={this.state.task}
          handleCancel={this.closeModal}
        />
        {this.state.taskLibrary ? (
          <TaskBox>
            <div className="editPanelTopBar">
              Task Library
              <span onClick={this.toggleTaskLibrary}>
                <i className="fa fa-times" />
              </span>
            </div>
            <div className="editPanelContent">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Search
                  placeholder="Search by name, tag or keyword"
                  style={{ marginRight: "10px", height: "40px" }}
                />
                <Button
                  style={{
                    height: "40px",
                    backgroundColor: "orange",
                    color: "black"
                  }}
                  onClick={() => this.taskModal("new")}
                >
                  <i
                    className="fa fa-plus"
                  />
                  &nbsp; Create Task
                </Button>
              </div>
            </div>
            
            <Tabs tabBarGutter={2}>
                <TabPane tab="Automation" key="1">
                  <Collapse accordion>
                    {automation.map((t, index) => (
                      <Panel
                        header={t.name + "(" + t.data.length + ")"}
                        key={index}
                      >
                        {t.data.map((p, ix) => (
                          <SingleTask key={ix}>
                            <div className="tName">
                              <span>{p.name}</span>
                              <i
                                className="fa fa-eye"
                                onClick={() => this.taskModal("view", p)}
                              />
                            </div>
                            <div className="tDesc">
                              <span>{p.description}</span>
                              <Button
                                className="addBtn"
                                size="small"
                                onClick={() =>
                                  this.addShape({
                                    type: "rect",
                                    task: "sub",
                                    text: p.name
                                  })
                                }
                              >
                                Add
                              </Button>
                            </div>
                          </SingleTask>
                        ))}
                      </Panel>
                    ))}
                  </Collapse>
                </TabPane>
                <TabPane tab="Manual Tasks" key="2">
                  Add Secondary action
                  <Button
                    style={{ float: "right" }}
                    onClick={() =>
                      this.addShape({
                        type: "rect",
                        task: "sub",
                        text: "Sub Task",
                        subText: "014"
                      })
                    }
                  >
                    Add Sub
                  </Button>
                </TabPane>
                <TabPane tab="Playbooks" key="3" />
              </Tabs>
          </TaskBox>
        ) : null}
        <PlaybookBox>
          <div id="container2">
            <Row id="btnControlRow">
              <Col span={24} style={{ padding: "20px 20px 10px 20px" }}>
                <span>
                  <Button
                    size="large"
                    onClick={this.toggleTaskLibrary}
                    style={{color:"black",background:"orange",marginRight: "10px"}}
                  >
                    <span className="fa fa-tasks" />
                    &nbsp; Task Library
                  </Button>
                  <Button size="large" onClick={() => this.taskModal("new")}>
                    <span className="fa fa-plus" />
                  </Button>
                </span>
                <span style={{ float: "right" }}>
                  <Button.Group style={{ marginRight: "10px" }} size="large">
                    <Button>
                      <span className="fa fa-plus" />
                    </Button>
                    <Button>
                      <span className="fa fa-arrows-h" />
                    </Button>
                    <Button>
                      <span className="fa fa-minus" />
                    </Button>
                  </Button.Group>
                  <Button.Group size="large">
                    <Button>
                      <span className="fa fa-undo" />
                    </Button>
                    <Button>
                      <span className="fa fa-repeat" />
                    </Button>
                  </Button.Group>
                </span>
              </Col>
            </Row>
            <canvas id="canvas2" style={{ cursor: this.style.cursor }}>
              This text is displayed if your browser does not support HTML5
              Canvas.
            </canvas>
          </div>
        </PlaybookBox>
      </PlaybookWindow>
    );
  }
}

class Box2 {
  shape;
  constructor(...rest) {
    this.shape = rest[0];
  }

  fittingString = (c, str) => {
    let maxWidth=200;
    let width = c.measureText(str).width;
    let ellipsis = '…';
    let ellipsisWidth = c.measureText(ellipsis).width;
    if (width<=maxWidth || width<=ellipsisWidth) {
        return str;
    } else {
        var len = str.length;
        while (width>=maxWidth-ellipsisWidth && len-->0) {
            str = str.substring(0, len);
            width = c.measureText(str).width;
        }
        return str+ellipsis;
    }
  }

  drawArrowhead(ctx,x1, y1, x2, y2) {
    let PI2 = Math.PI * 2;
    let dx = x2 - x1;
    let dy = y2 - y1;
    let radians = (Math.atan2(dy, dx) + PI2) % PI2;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.translate(x2, y2);
    ctx.rotate(radians);
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, 6);
    ctx.lineTo(-10, -6);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
}
  // we used to have a solo draw function
  // but now each box is responsible for its own drawing
  // mainDraw() will call this with the normal canvas
  // myDown will call this with the ghost canvas with 'black'
  draw(context, gctx) {
    if (context === gctx) {
      // context.fillStyle = "black"; // always want black for the ghost canvas
    } else {
      context.fillStyle = this.shape.fill;
    }

    // We can skip the drawing of elements that have moved off the screen:
    if (this.shape.x > this.WIDTH || this.shape.y > this.HEIGHT) return;
    if (this.shape.x + this.shape.w < 0 || this.shape.y + this.shape.h < 0)
      return;

    if (this.shape.type === "line") {
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.beginPath();
      context.moveTo(this.shape.x, this.shape.y);
      context.lineTo(this.shape.x2, this.shape.y2);
      context.stroke();
      this.drawArrowhead(context,this.shape.x, this.shape.y,this.shape.x2, this.shape.y2);
    } else if (this.shape.type === "rect") {
      //task background point start
      context.fillStyle = "black";
      let height = this.shape.task === "main" ? this.shape.h +10 :this.shape.h + 20;
      let calcY= this.shape.task === "main" ? this.shape.y : this.shape.y - 10;
      let width = 18;
      let rds = 10;
      context.beginPath();
      context.moveTo(this.shape.x + this.shape.w / 2 + rds, calcY);
      context.lineTo(
        this.shape.x + this.shape.w / 2 + width - rds,
        calcY
      );
      context.quadraticCurveTo(
        this.shape.x + this.shape.w / 2 + width,
        calcY,
        this.shape.x + this.shape.w / 2 + width,
        calcY + rds
      );
      context.lineTo(
        this.shape.x + this.shape.w / 2 + width,
        calcY + height - rds
      );
      context.quadraticCurveTo(
        this.shape.x + this.shape.w / 2 + width,
        calcY + height,
        this.shape.x + this.shape.w / 2 + width - rds,
        calcY + height
      );
      context.lineTo(
        this.shape.x + this.shape.w / 2 + rds,
        calcY + height
      );
      context.quadraticCurveTo(
        this.shape.x + this.shape.w / 2,
        calcY + height,
        this.shape.x + this.shape.w / 2,
        calcY + height - rds
      );
      context.lineTo(this.shape.x + this.shape.w / 2, calcY + rds);
      context.quadraticCurveTo(
        this.shape.x + this.shape.w / 2,
        calcY,
        this.shape.x + this.shape.w / 2 + rds,
        calcY
      );
      context.closePath();
      context.fill();
      //task background point end

      //task start
      let radius =
        this.shape.task === "main"
          ? { tl: 25, tr: 25, br: 25, bl: 25 }
          : { tl: 5, tr: 5, br: 5, bl: 5 };

      context.fillStyle = this.shape.fill;
      context.shadowBlur = 5;
      context.shadowColor = this.shape.task === "main" ? "#8590a1" : "#a5c7f1";
      context.strokeStyle = this.shape.task === "main" ? "#8590a1" : "#d9dddd";

      context.beginPath();
      context.moveTo(this.shape.x + radius.tl, this.shape.y);
      context.lineTo(this.shape.x + this.shape.w - radius.tr, this.shape.y);
      context.quadraticCurveTo(
        this.shape.x + this.shape.w,
        this.shape.y,
        this.shape.x + this.shape.w,
        this.shape.y + radius.tr
      );
      context.lineTo(
        this.shape.x + this.shape.w,
        this.shape.y + this.shape.h - radius.br
      );
      context.quadraticCurveTo(
        this.shape.x + this.shape.w,
        this.shape.y + this.shape.h,
        this.shape.x + this.shape.w - radius.br,
        this.shape.y + this.shape.h
      );
      context.lineTo(this.shape.x + radius.bl, this.shape.y + this.shape.h);
      context.quadraticCurveTo(
        this.shape.x,
        this.shape.y + this.shape.h,
        this.shape.x,
        this.shape.y + this.shape.h - radius.bl
      );
      context.lineTo(this.shape.x, this.shape.y + radius.tl);
      context.quadraticCurveTo(
        this.shape.x,
        this.shape.y,
        this.shape.x + radius.tl,
        this.shape.y
      );
      context.closePath();
      context.fill();
      //task end

      context.shadowBlur = 0;
      // context.textAlign = "center";
      context.textBaseline = "middle";
      if (this.shape.task === "main") {
        context.font = "15px Tahoma, Geneva, sans-serif";
        context.fillStyle = "#fbfcfc";
        context.fillText(
          this.fittingString(context,this.shape.text),
          this.shape.x + 20,
          this.shape.y + this.shape.h / 2
        );
        context.font = "10px Tahoma, Geneva, sans-serif";
        context.fillStyle = "#cdd4df";
        context.fillText(
          this.shape.subText,
          this.shape.x + this.shape.w - context.measureText(this.shape.subText).width- 20,
          this.shape.y + this.shape.h / 2
        );
      } else {
        context.font = "14px Tahoma, Geneva, sans-serif";
        context.fillStyle = "#5a5a5a";
        context.fillText(
          "->",
          this.shape.x + 20,
          this.shape.y + 20
        );
        context.fillText(
          this.shape.text,
          this.shape.x + 40,
          this.shape.y + 20
        );
        context.font = "11px Tahoma, Geneva, sans-serif";
        context.fillStyle = "#b3bbbc";
        context.fillText(
          "#" + this.shape.subText,
          this.shape.x + 20,
          this.shape.y + 60
        );
        context.fillText(
          "Delete",
          this.shape.x +
            this.shape.w -
            context.measureText("delete").width -
            10,
          this.shape.y + 20
        );
        context.fillText(
          "Copy",
          this.shape.x +
            this.shape.w -
            context.measureText("Copy").width -
            10,
          this.shape.y + 40
        );
        context.fillText(
          "Preview",
          this.shape.x +
            this.shape.w -
            context.measureText("Preview").width -
            context.measureText("Edit").width - 20,
          this.shape.y + 60
        );
        context.fillText(
          "Edit",
          this.shape.x +
            this.shape.w -
            context.measureText("Edit").width -
            10,
          this.shape.y + 60
        );
      }
    }
  } // end draw
}

export default Playbook;
