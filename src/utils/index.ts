import {
    convertPlotSizeToByte,
    DATE_FORMAT,
    MONTH_FORMAT,
    YEAR_FORMAT
} from "./constant";
import {DataSSCRewards} from "./type";
import moment from "moment-timezone";

export function getDataSimpleReward(totalNetworkSize: number, numberOfPlot: number, exchangeRateUsd: number, unit: string) {
    let daily = 0;
    let dailyUSD = 0;
    let year = 0;
    let yearUSD = 0;
    let month = 0;
    let monthUSD = 0;
    let percent = 0;
    let changeToWinYear = 0;
    let changeToWinDaily = 0;
    let changeToWinMonth = 0;
    const numberRewardPerBlock = 10;
    const blockTime = 6;
    let expectedTimeToWin = 0
    let userPlotSize = convertPlotSizeToByte(numberOfPlot, unit);
    if (totalNetworkSize > 0) {
        const ratio = userPlotSize / totalNetworkSize;
        const changeToWinPerBlock = ratio * numberRewardPerBlock;
        const dailyTotal = ratio * 24 * 60;
        percent = (ratio * 100);
        const dailyUSDTotal = dailyTotal * exchangeRateUsd;
        daily = dailyTotal;
        dailyUSD = dailyUSDTotal;
        year = (dailyTotal * 365);
        yearUSD = (dailyUSDTotal * 365);
        month = (dailyTotal * 365 / 12);
        monthUSD = (dailyUSDTotal * 365 / 12)
        expectedTimeToWin = blockTime / changeToWinPerBlock;
        const changeToWinPerHour = changeToWinPerBlock * 600;
        changeToWinYear = (changeToWinPerHour * 24 * 365);
        changeToWinDaily = (changeToWinPerHour * 24);
        changeToWinMonth = (changeToWinPerHour * 24 * 30);
        if (changeToWinYear > 100) {
            changeToWinYear = 100;
        }
        if (changeToWinDaily > 100) {
            changeToWinDaily = 100;
        }
        if (changeToWinMonth > 100) {
            changeToWinMonth = 100;
        }
    }

    return {
        userPlotSize,
        daily,
        dailyUSD,
        year,
        yearUSD,
        month,
        monthUSD,
        expectedTimeToWin, percent, changeToWinYear, changeToWinDaily, changeToWinMonth
    } as DataSSCRewards;
}

function roundNumber(num: number, scale: number) {
    if (!("" + num).includes("e")) {
        return +(Math.round(Number(num + "e+" + scale)) + "e-" + scale);
    } else {
        const arr = ("" + num).split("e");
        let sig = ""
        if (+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(Number(+arr[0] + "e" + sig + (+arr[1] + scale))) + "e-" + scale);
    }
}

export function getCapitalInvestmentChart(estimateCost: number, electricCost: number, unitElectricTime: string, rewardValue: number) {
    let costValue = estimateCost;
    let electricCostPerDay = electricCost;
    if (unitElectricTime === 'hour') {
        electricCostPerDay = electricCost * 24;
    }
    if (unitElectricTime === 'weekly') {
        electricCostPerDay = electricCost / 7;
    }
    if (rewardValue === 0 || costValue === 0) {
        return {};
    }
    const totalEarnings = [0];
    const costBeginDay = costValue + electricCostPerDay;
    const profitList = [-costBeginDay];
    const totalCostList = [roundNumber(costBeginDay, 2)];
    const now = moment();
    let k = 1;
    let rewardCost = 0;
    let accumulatedCosts = costBeginDay;
    const daysEstimate = Math.ceil(costValue / rewardValue);
    let timePoint = 1;
    let format = DATE_FORMAT;
    if (daysEstimate > 180) {
        timePoint = 180;
        format = MONTH_FORMAT;
    }
    if (daysEstimate > (365 * 2)) {
        timePoint = 365 * 2;
        format = YEAR_FORMAT;
    }
    const dataAxis = [now.format(format)];
    if (costValue > 0 && rewardValue > 0) {
        while (rewardCost < accumulatedCosts * 1.1) {
            const numberDay = k * timePoint;
            const nextDay = now.clone().add(numberDay, 'days');
            if (nextDay.diff(now, 'years') > 10) {
                break;
            }
            dataAxis.push(nextDay.format(format));
            rewardCost = rewardValue * numberDay;
            totalEarnings.push(roundNumber(rewardCost, 2));
            accumulatedCosts = costValue + electricCostPerDay * (numberDay + 1);
            totalCostList.push(roundNumber(accumulatedCosts, 2));
            profitList.push(roundNumber(rewardCost - accumulatedCosts, 2));
            k++;
        }
    }

    return {
        title: {
            text: 'Chart',
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params: any) {
                let text = `<strong>${params[0].name}</strong> <br>`;
                params.forEach((param: any) => {
                    text += `<span style="color: ${param.color};">
                        <span>${param.marker} ${param.seriesName}:</span> 
                        <span>$${param.data}</span>
                        </span> <br>`;
                })
                return text;
            }
        },
        legend: {
            data: ['Total Earnings', 'Total Cost', 'Profitability']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataAxis
        },
        yAxis: {
            type: null,
            // show: false
        },
        series: [
            {
                name: 'Total Earnings',
                type: 'line',
                showSymbol: false,
                data: totalEarnings
            },
            {
                name: 'Total Cost',
                type: 'line',
                showSymbol: false,
                data: totalCostList
            },

            {
                name: 'Profitability',
                type: 'line',
                areaStyle: {},
                showSymbol: false,
                data: profitList
            }
        ]
    }
}
