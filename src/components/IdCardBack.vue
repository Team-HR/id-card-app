<template>
  <div id="IdCardBack" style="
      /* border: 1px solid gray; */
      /* background-color: aqua; */
      width: 640px;
      height: 1014px;
      font-size: 7pt;
      position: relative;
      background-image: url('/images/REG_ID_Back_Temp.jpg');
      background-position: center;
      background-size: contain;
      font-family: sans-serif;
      transform: scale(0.5);
      top: -200px;
      left: 185px;
    ">
    <!-- QR start -->
    <!-- <img
      src="~/assets/images/qr_sample.png"
      style="position: absolute; right: 4px; top: 109px; width: 134px"
    /> -->
    <!-- QR end -->
    <div :hidden="!details.address_res_barangay" class="detail" style="
        position: absolute;
        top: 170px;
        left: 35px;
        overflow: hidden;
        width: 559px;
        height: 59px;
        font-size: 22pt;
        line-height: 23pt;
      ">
      <!-- {{ details.address }} -->
      BRGY. {{ details.address_res_barangay ? details.address_res_barangay + ", " : "" }}
      {{ details.address_res_city }}, {{ details.address_res_zip_code }},
      {{ details.address_res_province }}, {{ details.address_res_country }}
    </div>

    <div style="position: absolute; top: 242px; left: 347px">
      <img id="qr-img" style="height: 300px; width: 300px" alt="" />
    </div>

    <div class="detail" style="position: absolute; top: 283px; left: 42px; font-size: 22pt">
      {{ details.gender }}
    </div>

    <div class="detail" style="position: absolute; top: 363px; left: 42px; font-size: 22pt">
      {{ details.date_of_birth }}
    </div>

    <div class="detail" style="position: absolute; top: 442px; left: 42px; font-size: 22pt">
      {{ details.blood_type }}
    </div>

    <div class="detail" style="position: absolute; top: 521px; left: 42px; font-size: 22pt">
      {{ details.contact_number }}
    </div>

    <div style="
        width: 100%;
        text-align: left;
        position: absolute;
        bottom: 376px;
        left: 53px;
        font-size: 22pt;
      ">
      {{ details.emergency_name }}
    </div>

    <div style="
        width: 100%;
        text-align: left;
        position: absolute;
        bottom: 344px;
        left: 53px;
        font-size: 22pt;
      ">
      {{ details.emergency_number }}
    </div>

    <div class="detail" style="position: absolute; top: 671px; left: 204px; font-size: 19pt">
      {{ details.date_issued_formatted }}
    </div>

    <div class="detail" style="position: absolute; top: 705px; left: 204px; font-size: 19pt">
      {{ details.date_expire_formatted }}
    </div>

    <!-- signature container start -->
    <div style="
        width: 100%;
        /* height: 20px; */
        position: absolute;
        top: 354px;
        text-align: center;
      " id="signatureDiv" @click="getSignatureDialog()">
      <!-- src="~/assets/images/get_sig.png" -->
      <!-- :hidden="details.name ? false : true" -->
      <img :hidden="!details.sig_src" id="signatureImage" class="signatureImage" style="
          height: 227px;
          width: 359px;
          /* vertical-align: bottom; */
          position: absolute;
          /* bottom: -146px;
          left: -27px; */
          bottom: -584px;
          left: 151px;
          /* transform: scale(0.4); */
        " />
      <img :hidden="details.sig_src" src="~/assets/images/get_sig.png" style="
          height: 227px;
          width: 359px;
          /* vertical-align: bottom; */
          position: absolute;
          /* bottom: -146px;
          left: -27px; */
          bottom: -584px;
          left: 151px;
          /* transform: scale(0.4); */
        " />

    </div>

    <!-- signature container end -->
    <!-- <div
      style="
        position: absolute;
        bottom: 76px;
        width: 100%;
        text-align: center;
        font-size: 8pt;
      "
    >
      <b>{{ details.name }}</b>
    </div> -->
  </div>

  <q-dialog v-model="Dialog" backdrop-filter="sepia(90%)" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none text-h6">
        Signature
      </q-card-section>

      <q-card-section>
        <!-- This dialog has a backdrop filter of sepia(90%). -->
        <div id="sigPreviewContainer" style="position: relative"></div>

        <!-- ok btn -->
        <div style="
            width: 107px;
            height: 29px;
            /* background-color: green; */
            position: absolute;
            bottom: 16px;
            left: 16px;
          " @click="btnOk_Click()"></div>
        <!-- clear btn -->
        <div style="
            width: 107px;
            height: 29px;
            /* background-color: grey; */
            position: absolute;
            bottom: 16px;
            left: 125px;
          " @click="btnClear_Click"></div>
        <!-- cancel btn -->
        <div style="
            width: 107px;
            height: 29px;
            /* background-color: red; */
            position: absolute;
            bottom: 16px;
            right: 12px;
          " @click="btnCancel_Click"></div>
      </q-card-section>

      <!-- <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions> -->

      <!-- <canvas id="canvas"></canvas> -->
    </q-card>
  </q-dialog>
</template>

<style>
.detail {
  margin-left: 10px;
}
</style>

<script setup>
import "assets/libs/q.js";
import WacomGSS from "assets/libs/wgssStuSdk.js";
import { ref, watch } from "vue";
import axios from "axios";

import QRCode from "qrcode";

// QRCode.toCanvas(document.getElementById("canvas"), "sample text", function (error) {
//   if (error) console.error(error);
//   console.log("success!");
// });

// With promises
// QRCode.toDataURL("https://ihris.hrmdo-lgubayawan.link/verify/index.php?id=15867")
//   .then((url) => {
//     console.log("QRCode: ", url);
//     var qr_el = document.getElementById("qr-img");
//     qr_el.src = url;
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// With async/await
const generateQR = async (text) => {
  try {
    var qr_el = document.getElementById("qr-img");
    qr_el.src = await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};

defineOptions({
  name: "IdCardBack",
});

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["onPenDataSave"]);

function savePenData() {
  emit("onPenDataSave", m_penData);
}

var Dialog = ref(false);

var BTN_TEXT_CANCEL = "Cancel";
var BTN_TEXT_CLEAR = "Clear";
var BTN_TEXT_OK = "OK";
var MAXRETRIES = 20;
var TIMEOUT_LONG = 1000;
var TIMEOUT_SHORT = 500;

var canvas;
var ctx;
var formDiv;
var intf;
var isDown;
var lastPoint;
var m_btns; // The array of buttons that we are emulating.
var m_clickBtn = -1;
var m_capability;
var m_encodingMode;
var m_imgData;
var m_inkThreshold;
var m_penData;
var m_usbDevices;
var modalBackground;
var protocol;
var retry = 0;
var tablet;

watch(
  () => props.details,
  (newValue, oldValue) => {
    // Note: `newValue` will be equal to `oldValue` here
    // *unless* state.someObject has been replaced
    // console.log("sig_Src: ", newValue.sig_src);

    if (newValue.sig_src) {
      m_penData = newValue.sig_src;
      m_capability = {
        encodingFlag: 3,
        maxReportRate: 200,
        resolution: 64000,
        screenHeight: 227,
        screenWidth: 359,
        tabletMaxPressure: 1023,
        tabletMaxX: 9600,
        tabletMaxY: 6000,
      };

      m_inkThreshold = { offPressureMark: 16, onPressureMark: 21 };

      // start
      // promptSigDialog();
      generateImage();
    }
    generateQR(
      "https://ihris.hrmdo-lgubayawan.link/verify/index.php?id=" +
      props.details.employees_id
    );
  },
  { deep: true }
);

function checkForSigCaptX() {
  // Establishing a connection to SigCaptX Web Service can take a few seconds,
  // particularly if the browser itself is still loading/initialising
  // or on a slower machine.
  retry = retry + 1;
  if (WacomGSS.STU.isServiceReady()) {
    retry = 0;
    console.log("SigCaptX Web Service: ready");
  } else {
    console.log("SigCaptX Web Service: not connected");
    if (retry < MAXRETRIES) {
      setTimeout(checkForSigCaptX, TIMEOUT_LONG);
    } else {
      console.log("Unable to establish connection to SigCaptX");
    }
  }
}

setTimeout(checkForSigCaptX, TIMEOUT_SHORT);

function onDCAtimeout() {
  // Device Control App has timed-out and shut down
  // For this sample, we just closedown promptSigDialog (assuming it's running)
  console.log("DCA disconnected");
  setTimeout(close, 0);
}

function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.Contains = function (pt) {
    if (
      pt.x >= this.x &&
      pt.x <= this.x + this.width &&
      pt.y >= this.y &&
      pt.y <= this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
  };
}

// In order to simulate buttons, we have our own Button class that stores the bounds and event handler.
// Using an array of these makes it easy to add or remove buttons as desired.
//  delegate void ButtonClick();
function Button() {
  this.Bounds; // in Screen coordinates
  this.Text;
  this.Click;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function createModalWindow(width, height) {
  // Creates the modal window on the PC monitor
  // sigPreviewContainer
  // modalBackground = document.createElement("div");
  // modalBackground.id = "modal-background";
  // modalBackground.className = "active";
  // modalBackground.style.position = "relative";
  // modalBackground.style.width = window.innerWidth;
  // modalBackground.style.height = window.innerHeight;

  // // document.getElementsByTagName("body")[0].appendChild(modalBackground);
  // document.getElementById("sigPreviewContainer").appendChild(modalBackground);

  formDiv = document.createElement("div");
  formDiv.id = "signatureWindow";
  formDiv.className = "active";
  formDiv.style.position = "relative";
  formDiv.style.top = 0 + "px";
  formDiv.style.left = 0 + "px";
  formDiv.style.width = width + "px";
  formDiv.style.height = height + "px";

  // document.getElementsByTagName("body")[0].appendChild(formDiv);
  document.getElementById("sigPreviewContainer").appendChild(formDiv);
  // document.getElementById("sigPreviewContainer")[0].appendChild(formDiv);
  canvas = document.createElement("canvas");
  canvas.id = "myCanvas";
  canvas.height = formDiv.offsetHeight;
  canvas.width = formDiv.offsetWidth;
  // z-index:999
  canvas.style.zIndex = 999;
  formDiv.appendChild(canvas);
  ctx = canvas.getContext("2d");
  console.log("canvas.addEventListener:", canvas.addEventListener);
  if (canvas.addEventListener) {
    canvas.addEventListener("click", onCanvasClick, false);
    console.log("onCanvasClick 0");
  } else if (canvas.attachEvent) {
    canvas.attachEvent("onClick", onCanvasClick);
    console.log("onCanvasClick 1");
  } else {
    canvas["onClick"] = onCanvasClick;
    console.log("onCanvasClick 2");
  }
}

function disconnect() {
  var deferred = Q.defer();

  if (!(undefined === tablet || null === tablet)) {
    var p = new WacomGSS.STU.Protocol();
    tablet
      .setInkingMode(p.InkingMode.InkingMode_Off)
      .then(function (message) {
        console.log("received: " + JSON.stringify(message));
        return tablet.endCapture();
      })
      .then(function (message) {
        console.log("received: " + JSON.stringify(message));
        if (m_imgData !== null) {
          return m_imgData.remove();
        } else {
          return message;
        }
      })
      .then(function (message) {
        console.log("received: " + JSON.stringify(message));
        m_imgData = null;
        return tablet.setClearScreen();
      })
      .then(function (message) {
        console.log("received: " + JSON.stringify(message));
        return tablet.disconnect();
      })
      .then(function (message) {
        console.log("received: " + JSON.stringify(message));
        tablet = null;
        clearCanvas(canvas, ctx);
      })
      .then(function (message) {
        deferred.resolve();
      })
      .fail(function (message) {
        console.log("disconnect error: " + message);
        deferred.resolve();
      });
  } else {
    deferred.resolve();
  }
  return deferred.promise;
}

window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "";
  WacomGSS.STU.close();
  (e || window.event).returnValue = confirmationMessage; // Gecko + IE
  return confirmationMessage; // Webkit, Safari, Chrome
});

// Error-derived object for Device Control App not ready exception
function DCANotReady() { }
DCANotReady.prototype = new Error();

function getSignatureDialog() {
  Dialog.value = true;
  promptSigDialog();
}

function promptSigDialog() {
  var p = new WacomGSS.STU.Protocol();
  var intf;
  var m_encH;
  var m_encH2;
  var m_encH2Impl;

  WacomGSS.STU.isDCAReady()
    .then(function (message) {
      if (!message) {
        throw new DCANotReady();
      }
      // Set handler for Device Control App timeout
      WacomGSS.STU.onDCAtimeout = onDCAtimeout;

      return WacomGSS.STU.getUsbDevices();
    })
    .then(function (message) {
      if (message == null || message.length == 0) {
        throw new Error("No STU devices found");
      }
      console.log("received: " + JSON.stringify(message));
      m_usbDevices = message;
      return WacomGSS.STU.isSupportedUsbDevice(
        m_usbDevices[0].idVendor,
        m_usbDevices[0].idProduct
      );
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      intf = new WacomGSS.STU.UsbInterface();
      return intf.Constructor();
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      return intf.connect(m_usbDevices[0], true);
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      tablet = new WacomGSS.STU.Tablet();
      return tablet.Constructor(intf, m_encH, m_encH2);
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      intf = null;
      return tablet.getInkThreshold();
    })
    .then(function (message) {
      console.log("m_inkThreshold received: " + JSON.stringify(message));
      m_inkThreshold = message;
      return tablet.getCapability();
    })
    .then(function (message) {
      console.log("m_capability received: " + JSON.stringify(message));
      m_capability = message;

      createModalWindow(m_capability.screenWidth, m_capability.screenHeight);
      return tablet.getInformation();
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      return tablet.getInkThreshold();
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      return tablet.getProductId();
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      return WacomGSS.STU.ProtocolHelper.simulateEncodingFlag(
        message,
        m_capability.encodingFlag
      );
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      var encodingFlag = message;
      if ((encodingFlag & p.EncodingFlag.EncodingFlag_24bit) != 0) {
        return tablet.supportsWrite().then(function (message) {
          m_encodingMode = message
            ? p.EncodingMode.EncodingMode_24bit_Bulk
            : p.EncodingMode.EncodingMode_24bit;
        });
      } else if ((encodingFlag & p.EncodingFlag.EncodingFlag_16bit) != 0) {
        return tablet.supportsWrite().then(function (message) {
          m_encodingMode = message
            ? p.EncodingMode.EncodingMode_16bit_Bulk
            : p.EncodingMode.EncodingMode_16bit;
        });
      } else {
        // assumes 1bit is available
        m_encodingMode = p.EncodingMode.EncodingMode_1bit;
      }
    })
    .then(function (message) {
      return tablet.setClearScreen();
    })
    .then(function (message) {
      console.log("received from setClearScreen: " + JSON.stringify(message));
      return message;
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      return tablet.isSupported(p.ReportId.ReportId_PenDataOptionMode);
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      if (message) {
        return tablet.getProductId().then(function (message) {
          var penDataOptionMode = p.PenDataOptionMode.PenDataOptionMode_None;
          switch (message) {
            case WacomGSS.STU.ProductId.ProductId_520A:
              penDataOptionMode = p.PenDataOptionMode.PenDataOptionMode_TimeCount;
              break;
            case WacomGSS.STU.ProductId.ProductId_430:
            case WacomGSS.STU.ProductId.ProductId_530:
            case WacomGSS.STU.ProductId.ProductId_540:
              penDataOptionMode = p.PenDataOptionMode.PenDataOptionMode_TimeCountSequence;
              break;
            default:
              console.log(
                "Unknown tablet supporting PenDataOptionMode, setting to None."
              );
          }
          return tablet.setPenDataOptionMode(penDataOptionMode);
        });
      } else {
        m_encodingMode = p.EncodingMode.EncodingMode_1bit;
        return m_encodingMode;
      }
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      addButtons();
      var canvasImage = canvas.toDataURL("image/png");
      return WacomGSS.STU.ProtocolHelper.resizeAndFlatten(
        canvasImage,
        0,
        0,
        0,
        0,
        m_capability.screenWidth,
        m_capability.screenHeight,
        m_encodingMode,
        1,
        false,
        0,
        true
      );
    })
    .then(function (message) {
      m_imgData = message;
      console.log("received: " + JSON.stringify(message));
      return tablet.writeImage(m_encodingMode, message);
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      return tablet.setInkingMode(p.InkingMode.InkingMode_On);
    })
    .then(function (message) {
      console.log("received: " + JSON.stringify(message));
      var reportHandler = new WacomGSS.STU.ProtocolHelper.ReportHandler();
      lastPoint = { x: 0, y: 0 };
      isDown = false;
      ctx.lineWidth = 1;

      var penData = function (report) {
        //console.log("report: " + JSON.stringify(report));
        processButtons(report, canvas);
        processPoint(report, canvas, ctx);
        m_penData.push(report);
      };

      var penDataEncryptedOption = function (report) {
        //console.log("reportOp: " + JSON.stringify(report));
        processButtons(report.penData[0], canvas);
        processPoint(report.penData[0], canvas, ctx);
        processButtons(report.penData[1], canvas);
        processPoint(report.penData[1], canvas, ctx);
        m_penData.push(report.penData[0], report.penData[1]);
      };

      var log = function (report) {
        //console.log("report: " + JSON.stringify(report));
      };

      var decrypted = function (report) {
        //console.log("decrypted: " + JSON.stringify(report));
      };

      m_penData = new Array();
      reportHandler.onReportPenData = penData;
      reportHandler.onReportPenDataOption = penData;
      reportHandler.onReportPenDataTimeCountSequence = penData;
      reportHandler.onReportPenDataEncrypted = penDataEncryptedOption;
      reportHandler.onReportPenDataEncryptedOption = penDataEncryptedOption;
      reportHandler.onReportPenDataTimeCountSequenceEncrypted = penData;
      reportHandler.onReportDevicePublicKey = log;
      reportHandler.onReportEncryptionStatus = log;
      reportHandler.decrypt = decrypted;
      return reportHandler.startReporting(tablet, true);
    })
    .fail(function (ex) {
      console.log(ex);

      if (ex instanceof DCANotReady) {
        // Device Control App not detected
        // Reinitialize and re-try
        WacomGSS.STU.Reinitialize();
        setTimeout(promptSigDialog, TIMEOUT_LONG);
      } else {
        // Some other error - Inform the user and closedown
        alert("promptSigDialog failed:\n" + ex);
        setTimeout(close(), 0);
      }
    });
}

function addButtons() {
  m_btns = new Array(3);
  m_btns[0] = new Button();
  m_btns[1] = new Button();
  m_btns[2] = new Button();

  if (m_usbDevices[0].idProduct != WacomGSS.STU.ProductId.ProductId_300) {
    // Place the buttons across the bottom of the screen.
    var w2 = m_capability.screenWidth / 3;
    var w3 = m_capability.screenWidth / 3;
    var w1 = m_capability.screenWidth - w2 - w3;
    var y = (m_capability.screenHeight * 6) / 7;
    var h = m_capability.screenHeight - y;

    m_btns[0].Bounds = new Rectangle(0, y, w1, h);
    m_btns[1].Bounds = new Rectangle(w1, y, w2, h);
    m_btns[2].Bounds = new Rectangle(w1 + w2, y, w3, h);
  } else {
    // The STU-300 is very shallow, so it is better to utilise
    // the buttons to the side of the display instead.

    var x = (m_capability.screenWidth * 3) / 4;
    var w = m_capability.screenWidth - x;

    var h2 = m_capability.screenHeight / 3;
    var h3 = m_capability.screenHeight / 3;
    var h1 = m_capability.screenHeight - h2 - h3;

    m_btns[0].Bounds = new Rectangle(x, 0, w, h1);
    m_btns[1].Bounds = new Rectangle(x, h1, w, h2);
    m_btns[2].Bounds = new Rectangle(x, h1 + h2, w, h3);
  }

  m_btns[0].Text = BTN_TEXT_OK;
  m_btns[1].Text = BTN_TEXT_CLEAR;
  m_btns[2].Text = BTN_TEXT_CANCEL;
  m_btns[0].Click = btnOk_Click;
  m_btns[1].Click = btnClear_Click;
  m_btns[2].Click = btnCancel_Click;
  clearCanvas(canvas, ctx);
  drawButtons();
}

function drawButtons() {
  // This application uses the same bitmap for both the screen and client (window).

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.font = "30px Arial";

  // Draw the buttons
  for (var i = 0; i < m_btns.length; ++i) {
    //if (useColor)
    {
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(
        m_btns[i].Bounds.x,
        m_btns[i].Bounds.y,
        m_btns[i].Bounds.width,
        m_btns[i].Bounds.height
      );
    }

    ctx.fillStyle = "black";
    ctx.rect(
      m_btns[i].Bounds.x,
      m_btns[i].Bounds.y,
      m_btns[i].Bounds.width,
      m_btns[i].Bounds.height
    );
    var xPos =
      m_btns[i].Bounds.x +
      (m_btns[i].Bounds.width / 2 - ctx.measureText(m_btns[i].Text).width / 2);
    var yOffset;
    if (m_usbDevices[0].idProduct == WacomGSS.STU.ProductId.ProductId_300) yOffset = 28;
    else if (m_usbDevices[0].idProduct == WacomGSS.STU.ProductId.ProductId_430)
      yOffset = 26;
    else yOffset = 40;
    ctx.fillText(m_btns[i].Text, xPos, m_btns[i].Bounds.y + yOffset);
  }
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}

function clearScreen() {
  clearCanvas(canvas, ctx);
  drawButtons();
  m_penData = new Array();
  tablet.writeImage(m_encodingMode, m_imgData);
}

function btnOk_Click() {
  // You probably want to add additional processing here.
  // console.log("this.dialog: ", this.dialog);
  console.log("btnOk_Click: ", this);
  generateImage();
  setTimeout(close, 0);
}

function btnCancel_Click() {
  // You probably want to add additional processing here.
  setTimeout(close, 0);
}

function btnClear_Click() {
  // You probably want to add additional processing here.
  console.log("clear!");
  clearScreen();
}

function distance(a, b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
}

function clearCanvas(in_canvas, in_ctx) {
  in_ctx.save();
  in_ctx.setTransform(1, 0, 0, 1, 0, 0);
  in_ctx.fillStyle = "white"; // "#ffffff00";
  in_ctx.fillRect(0, 0, in_canvas.width, in_canvas.height);
  in_ctx.restore();
}

function clearCanvasOut(in_canvas, in_ctx) {
  in_ctx.save();
  in_ctx.setTransform(1, 0, 0, 1, 0, 0);
  in_ctx.fillStyle = "#ffffff00"; // "#ffffff00";
  in_ctx.fillRect(0, 0, in_canvas.width, in_canvas.height);
  in_ctx.restore();
}

function processButtons(point, in_canvas) {
  var nextPoint = {};
  nextPoint.x = Math.round((in_canvas.width * point.x) / m_capability.tabletMaxX);
  nextPoint.y = Math.round((in_canvas.height * point.y) / m_capability.tabletMaxY);
  var isDown2 = isDown
    ? !(point.pressure <= m_inkThreshold.offPressureMark)
    : point.pressure > m_inkThreshold.onPressureMark;

  var btn = -1;
  for (var i = 0; i < m_btns.length; ++i) {
    if (m_btns[i].Bounds.Contains(nextPoint)) {
      btn = i;
      break;
    }
  }

  if (isDown && !isDown2) {
    if (btn != -1 && m_clickBtn === btn) {
      m_btns[btn].Click();
    }
    m_clickBtn = -1;
  } else if (btn != -1 && !isDown && isDown2) {
    m_clickBtn = btn;
  }
  return btn == -1;
}

function processPoint(point, in_canvas, in_ctx) {
  var nextPoint = {};
  nextPoint.x = Math.round((in_canvas.width * point.x) / m_capability.tabletMaxX);
  nextPoint.y = Math.round((in_canvas.height * point.y) / m_capability.tabletMaxY);
  var isDown2 = isDown
    ? !(point.pressure <= m_inkThreshold.offPressureMark)
    : point.pressure > m_inkThreshold.onPressureMark;

  if (!isDown && isDown2) {
    lastPoint = nextPoint;
  }

  if ((isDown2 && 10 < distance(lastPoint, nextPoint)) || (isDown && !isDown2)) {
    in_ctx.beginPath();
    in_ctx.moveTo(lastPoint.x, lastPoint.y);
    in_ctx.lineTo(nextPoint.x, nextPoint.y);
    in_ctx.stroke();
    in_ctx.closePath();
    lastPoint = nextPoint;
  }

  isDown = isDown2;
}

function generateImage() {
  console.log("generateImage");

  var signatureImage = document.getElementById("signatureImage");
  var signatureCanvas = document.createElement("canvas");
  signatureCanvas.id = "signatureCanvas";
  signatureCanvas.height = 227;//signatureImage.height; //227
  signatureCanvas.width = 359;//signatureImage.width; //359

  var signatureCtx = signatureCanvas.getContext("2d");
  signatureCtx.lineWidth = 2.5;
  signatureCtx.strokeStyle = "black";

  clearCanvasOut(signatureCanvas, signatureCtx);

  lastPoint = { x: 0, y: 0 };
  isDown = false;
  for (var i = 0; i < m_penData.length; i++) {
    processPoint(m_penData[i], signatureCanvas, signatureCtx);
  }

  // console.log("m_penData: ", m_penData);
  savePenData();

  signatureImage.src = signatureCanvas.toDataURL("image/png");
}

function close() {
  // Clear handler for Device Control App timeout
  // console.log("this.dialog close(): ", this.dialog);
  Dialog.value = false;
  WacomGSS.STU.onDCAtimeout = null;
  disconnect();
  // document.getElementsByTagName("body")[0].removeChild(modalBackground);
  // document.getElementsByTagName("body")[0].removeChild(formDiv);
  // document.getElementById("sigPreviewContainer").removeChild(modalBackground);
  document.getElementById("sigPreviewContainer").removeChild(formDiv);
}

function onCanvasClick(event) {
  // Enable the mouse to click on the simulated buttons that we have displayed.

  // Note that this can add some tricky logic into processing pen data
  // if the pen was down at the time of this click, especially if the pen was logically
  // also 'pressing' a button! This demo however ignores any that.

  var posX = event.pageX - formDiv.offsetLeft;
  var posY = event.pageY - formDiv.offsetTop;

  for (var i = 0; i < m_btns.length; i++) {
    if (m_btns[i].Bounds.Contains(new Point(posX, posY))) {
      m_btns[i].Click();
      break;
    }
  }
}
</script>
