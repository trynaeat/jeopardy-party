import { Pool } from "pg";
import { GameBoard, Round, Question } from '../models';
import * as _ from 'lodash';
import { DateTime } from 'luxon';

const ROUND_VALUES = {
    [Round.JEOPARDY]: {
        oldValues: [100, 200, 300, 400, 500],
        newValues: [200, 400, 600, 800, 1000],
    },
    [Round.DOUBLE_JEOPARDY]: {
        oldValues: [200, 400, 600, 800, 1000],
        newValues: [400, 800, 1200, 1600, 2000],
    },
    [Round.FINAL_JEOPARDY]: {
        oldValues: [0],
        newValues: [0],
    }
};

export class GameUtils {
    public static async getShowBoard(db: Pool, showNum: number) {
        const q = 'SELECT * FROM questions WHERE show_number=$1 ORDER BY round DESC, category ASC';
        const result = _.get(await db.query(q, [showNum]), 'rows', []);
        const questions = _.map(result, q => {
            return {
                ...q,
                value: _.parseInt(_.replace(_.replace(q.value, '$', ''), ',', '')),
                airDate: DateTime.fromFormat(q.air_date, 'cccc, LLLL d, yyyy').toJSDate(),
            };
        }) as Question[];
        const rounds = _.groupBy(questions, 'round');
        const roundsGrouped = _.mapValues(rounds, (round, roundName) => {
            return _.mapValues(_.groupBy(round, 'category'), category => {
                return buildCategory(roundName as Round, category);
            });
        });
        const board: GameBoard = {
            [Round.JEOPARDY]: roundsGrouped[Round.JEOPARDY],
            [Round.DOUBLE_JEOPARDY]: roundsGrouped[Round.DOUBLE_JEOPARDY],
            [Round.FINAL_JEOPARDY]: roundsGrouped[Round.FINAL_JEOPARDY],
        };
        return board;
    }

    public static async getAllShowNumbers(db: Pool) {
        const result = await db.query('SELECT DISTINCT(show_number) FROM questions ORDER BY show_number');
        return result.rows;
      }
      
    public static async getRandomShowNum(db: Pool): Promise<number> {
    const showNumbers = await GameUtils.getAllShowNumbers(db);
        return _.get(showNumbers, [_.random(0, showNumbers.length), 'show_number']);
    }
}

/**
 * Do some surgery on a category of questions to build the proper column.
 * Daily doubles and questions that were never reached need to be filled in correctly
 * to make exactly 5 rows going from <start-value> - <end-value>
 * @param category
 */
function buildCategory(round: Round, category: Question[]) {
    // If it's final jeopardy, no further work needed
    if (round === Round.FINAL_JEOPARDY) {
        return category;
    }
    const values = getValues(round, category);
    const map = { } as { [key: number]: Question };
    _.each(values, value => {
        map[value] = _.find(category, { value });
        _.remove(category, q => q.value === value);
    });
    _.each(values, value => {
        // this can happen if the question was a daily double
        if (!map[value]) {
            if(category.length) {
                map[value] = _.assign(_.head(category), { value });
                category.shift();
            } else {
                map[value] = { 
                    value,
                    category: null,
                    question: null,
                    answer: null,
                    round: round,
                    showNumber: null,
                    isDailyDouble: false,
                    year: null,
                    airDate: null,
                    disabled: true,
                }; //Create a null question, it will be disabled on the final game board
            }
        }
    });
    return _.sortBy(_.values(map), 'value');
}

/**
 * Get the proper round values, whether old, or post Nov 26th 2001 (doubled)
 */
function getValues(round: Round, category: Question[]) {
    /* Fun fact, the values doubled on exactly Nov 26, 2001 (thanks wikipedia) */
    const switchDate = DateTime.local(2001, 11, 26).toJSDate();
    const airDate = category[0].airDate;
    if (airDate.getTime() < switchDate.getTime()) {
        return ROUND_VALUES[round].oldValues;
    }
    return ROUND_VALUES[round].newValues;
}