const userNewToDoContent = document.querySelector("#userNewToDoContent");
const saveUserNewToDoContent = document.querySelector("#saveUserNewToDoContent");
const listBoard = document.querySelector("#listBoard");
const viewTab = document.querySelector(".viewTab");

const limitDateBtn = document.querySelector("#limitDateBtn");
let setLimitDate = false;
let tempLimitDate = "none";

/**日期**/
let setDate = new Date();
let setYear = setDate.getFullYear();
let setMonth = setDate.getMonth();
let setDay = setDate.getDate();





let nowView = 'all';

let data = [
    {
        content: "系統預設事項系統預設事項系統預設事項1",
        checked: false,
        creatDate: "2022-12-12",
        limitDate: "2022-12-20"
    },
    {
        content: "系統預設事項2",
        checked: true,
        creatDate: "2022-12-12",
        limitDate: "2022-12-20"
    },
    {
        content: "系統預設事項3",
        checked: false,
        creatDate: "2022-12-12",
        limitDate: "none"
    }, {
        content: "系統預設事項4",
        checked: true,
        creatDate: "2022-12-12",
        limitDate: "none"
    },
    {
        content: "系統預設事項5",
        checked: false,
        creatDate: "2022-12-12",
        limitDate: "none"
    }
];

//localStorage.setItem('toDoData', JSON.stringify(data));

//看瀏覽器是否有存檔，有就讀取，代替data。
if (localStorage.getItem('toDoData') !== null) {
    let localData = JSON.parse(localStorage.getItem('toDoData'))
    data = localData;
};



const aHTML = `
<a href="javascript:void(0)" class="delete" data-fun="delete">X</a>
`; /**<a href="javascript:void(0)" class="edit" data-fun="edit">編輯</a>**/






function renderContent(show) { //匯出事項
    let tempAllLi = "";
    nowView = show;
    data.forEach(function (item, idx) {
        if (show === "all") { //匯出全部
            tempAllLi += `
                        <li data-idx="${idx}" class="${item.checked === true ? "checked" : "notcheck"} ${show}" >
                            <span>${item.content}<small>${item.limitDate !== "none" ? "期限：" + item.limitDate : ""} </small> </span>
                           ${aHTML}
                        </li>
                        `
        };
        if (show === "notcheck") { //匯出未完成
            if (item.checked === false) {
                tempAllLi += `
                        <li data-idx="${idx}" class="${item.checked === true ? "checked" : "notcheck"} ${show}" >
                            <span>${item.content} <small>${item.limitDate !== "none" ? "期限：" + item.limitDate : ""} </small></span>
                            ${aHTML}
                        </li>
                        `
            } else {
                tempAllLi += `<!---->`;
            }
        };
        if (show === "checked") { // 匯出已完成
            if (item.checked === true) {
                tempAllLi += `
                        <li data-idx="${idx}" class="${item.checked === true ? "checked" : "notcheck"} ${show}" >
                            <span>${item.content}</span>
                            ${aHTML}

                        </li>
                        `
            } else {
                tempAllLi += `<!---->`;
            }
        };

    }
    ); /**end forEach**/


    listBoard.innerHTML = tempAllLi;

};

renderContent("all"); //第一次預設匯出


//使用者存檔
saveUserNewToDoContent.addEventListener("click", item => {
    let newContent = userNewToDoContent.value.trim();

    if (newContent === "") {
        alert("請輸入資訊！");
        return
    };

    let tempObj = {
        content: newContent,
        checked: false,
        creatDate: `${setDate.getFullYear()}-${setDate.getMonth() + 1}-${setDate.getDate()}`
    };
    if (setLimitDate == true) { /**有設定完成日期 */
        tempObj.limitDate = tempLimitDate;
    } else {
        tempObj.limitDate = "none";/**沒有設定完成日期 */
    };




    data.push(tempObj);/**儲存至主data */
    localStorage.setItem('toDoData', JSON.stringify(data)); /**主data存檔到瀏覽器空間 */
    renderContent(nowView);/**重新渲染 */




    /**儲存結束後reset*/
    userNewToDoContent.value = ""
    limitDateBtn.checked = false;
    setLimitDate = false;
    tempLimitDate = "none";
    cal.classList.remove("act");


});


//使用者切換顯示代辦事項
listBoard.addEventListener("click", function (e) {

    let elePar = e.target.parentNode;
    let num = parseInt(elePar.getAttribute("data-idx"));


    if (e.target.getAttribute("data-fun") === "delete") { //是否點到刪除，如是則刪除 nodeName
        data.splice(num, 1);/**刪除指定陣列 */
        localStorage.setItem('toDoData', JSON.stringify(data)); /**主data存檔到瀏覽器空間 */
        renderContent(nowView);/**重新渲染 */
        return
    };


    if (elePar.classList.contains("checked")) { //如果是已經完成，則變更成未完成
        elePar.classList.remove("checked");
        data[num].checked = false;
        localStorage.setItem('toDoData', JSON.stringify(data));
    } else {//如果是未完成，則變更成完成
        elePar.classList.add("checked");
        data[num].checked = true;
        localStorage.setItem('toDoData', JSON.stringify(data));
    };
});



//切換顯示的按鈕效果
viewTab.addEventListener("click", function (e) {
    viewTab.querySelectorAll("a").forEach(function (allA) {
        allA.classList.remove("act");
    });

    e.target.classList.add("act");

});












//*以下是月曆產生*//
const cal = document.querySelector("#cal");
const calBoard = document.querySelector("#calBoard");
const monthBoard = document.querySelector("#monthBoard");
const yearhBoard = document.querySelector("#yearhBoard");
const nextMonth = document.querySelector("#nextMonth");
const prevMonth = document.querySelector("#prevMonth");



const monthData = {
    oly: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],/**閏月 */
    nor: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],/**正常 */
    name: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
};







//取得第一天星期幾
function getFirstDay(month, year) {
    let tempDay = new Date(year, month, 1);
    return (tempDay.getDay());
};

//取得月份天數
function getMonthDays(month, year) {


    if (year % 4 === 0) {/**4整除，就是閏月 */
        return (monthData.oly[month]);
    } else {
        return (monthData.nor[month]);
    };
};



function creatCal() {
    let tempLi = "";
    let totalDay = getMonthDays(setMonth, setYear);
    let firstDay = getFirstDay(setMonth, setYear);

    console.log(`這個月有：${totalDay} 天`);
    console.log(`這個月的第一天是 ${firstDay}`)

    for (let i = 1; i < firstDay; i++) {
        tempLi += `<li data-act="false" >-</li>`;
    };
    for (let i = 1; i <= totalDay; i++) {
        if (i === setDay && setYear == setDate.getFullYear() && setMonth == setDate.getMonth()) { //重新抓取日期與設定輸出的日期做比對
            tempLi += `<li class="today" data-act="true" data-year="${setYear}" data-month="${setMonth}" data-day="${i}"> ${i} </li>`;
        } else {
            tempLi += `<li data-act="true" data-year="${setYear}" data-month="${setMonth}" data-day="${i}"> ${i} </li>`;
        };

    };

    calBoard.innerHTML = tempLi;

    monthBoard.textContent = monthData.name[setMonth];
    yearhBoard.textContent = setYear;
};
creatCal();




nextMonth.addEventListener("click", function () {
    setMonth++;
    if (setMonth > 11) {
        setMonth = 0;
        setYear++
    };
    creatCal();
});

prevMonth.addEventListener("click", function () {


    setMonth--;
    if (setMonth < 0) {
        setMonth = 11;
        setYear--
    }
    creatCal();
});





//*以下設定月曆監聽取資料*//
calBoard.addEventListener("click", function (e) {
    setLimitDate = true;

    calBoard.querySelectorAll("li").forEach(function (e) {
        e.classList.remove("today");
    });

    e.target.classList.add("today");

    if (e.target.getAttribute("data-act") === "true") {
        tempLimitDate = `${e.target.getAttribute("data-year")}-${parseInt(e.target.getAttribute("data-month")) + 1}-${e.target.getAttribute("data-day")}`;

    } else {
        tempLimitDate = "none";
        alert("請選擇正確日期");
    };


});

















limitDateBtn.addEventListener("click", function () {
    tempLimitDate = `${setDate.getFullYear()}-${setDate.getMonth() + 1}-${setDate.getDate()}`;
    if (setLimitDate === false) {
        setLimitDate = true;
        cal.classList.add("act");
    } else {
        setLimitDate = false;
        cal.classList.remove("act");
    };
    console.log(setLimitDate)
})
