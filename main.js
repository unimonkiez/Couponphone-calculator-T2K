(function(){
    'use strict';
    if (!document.getElementById('yuval')) {
      var cardNumbers = [].slice.call(document.getElementsByClassName('cn'));
      var prices = [].slice.call(document.getElementsByClassName('pr'));
      prices = prices.filter(function(_, index) {
          return index !== (prices.length - 1);
      });
      var discounts = [].slice.call(document.querySelectorAll('#tdDiscountPrice'));
      var shopHistory = cardNumbers.map(function(cardNumberElement, index) {
          var cardNumber = cardNumberElement.childNodes[0].textContent.trim();
          var cost = Number(prices[index].innerHTML.trim().replace(/[^0-9.-]/g, ''));
          return {
              cardNumber: cardNumber,
              cost: cost
          }
      });
      var discountsPrices = discounts.map(function(el){
        return Number(el.innerHTML.trim());
      });

      var startDate = new Date(document.getElementById('txbStartDate').value.split('/').reverse().join('-'));
      var endDate = new Date(document.getElementById('txbEndDate').value.split('/').reverse().join('-'));

      function calcBusinessDays(dDate1, dDate2) { // input given as Date objects
          var iWeeks, iDateDiff, iAdjust = 0;
          if (dDate2 < dDate1) return -1; // error code if dates transposed
          var iWeekday1 = dDate1.getDay() + 1; // day of week
          var iWeekday2 = dDate2.getDay() + 1;
          if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
          iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
          iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

          // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
          iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

          if (iWeekday1 <= iWeekday2) {
              iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
          } else {
              iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
          }

          iDateDiff -= iAdjust // take into account both days on weekend

          return (iDateDiff + 1); // add 1 because dates are inclusive
      }
      var workDays = calcBusinessDays(startDate, endDate);

      var totalSpentOverall = shopHistory.reduce(function(a, b) {
          return a + b.cost;
      }, 0) - discountsPrices.reduce(function(a, b){
        return a + b;
      }, 0);

      var totalSpentOnMe = shopHistory.reduce(function(a, b) {
          return a + (b.cardNumber === '--' ? 0 : b.cost);
      }, 0) - discountsPrices.reduce(function(a, b){
        return a + b;
      }, 0);

      var row = document.createElement('tr');
      row.setAttribute('id', 'yuval');
      row.setAttribute('style', "background: #B6CEE6; font-weight: bold;");
      row.innerHTML = '<td id="ftTotalsText" class="tdCols" style="text-align: right;" colspan="4">סה"כ ע"י יובל</td><td class="TotalQt" style="text-align: center;"><input type="number" placeholder="ימי עבודה החודש" value="' + workDays + '"></td><td id="tdEmployeePrice" class="ep epTotal" style="text-align: center;">' + (totalSpentOnMe - (workDays * 25)).toFixed(2) + ' ₪</td><td id="tdEmployerPrice" class="rp rpTotal" style="text-align: center;">' + (workDays * 25) + ' ₪</td><td class="pr prTotal" style="text-align: center;">' + totalSpentOverall.toFixed(2) + ' ₪</td><td id="tdInfo" class="inf">&nbsp;</td>';
      var input = row.childNodes[1].childNodes[0];
      var tdTotalInMonthForMe = row.childNodes[2];
      var tdTotalInMonth = row.childNodes[3];
      document.getElementsByTagName('tfoot')[0].appendChild(row);

      input.addEventListener('keyup', function(e) {
          e.target.value = e.target.value.replace(/[^0-9]/, '');
          var newWorkDays = Number(e.target.value);
          if (newWorkDays < 0 || newWorkDays > 30) {
              e.target.value = 0;
          }
          updateByWorkDays(newWorkDays);
      });

      function updateByWorkDays(workDays) {
          var myTotal = workDays * 25;
          tdTotalInMonth.innerHTML = myTotal.toFixed(2) + ' ₪';
          tdTotalInMonthForMe.innerHTML = (totalSpentOnMe - myTotal).toFixed(2) + ' ₪';
      }
  }
})();
