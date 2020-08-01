"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var string_template_1 = __importDefault(require("string-template"));
var translate = require("@vitalets/google-translate-api");
function isDev() {
    return process && process.env && process.env.DEV === "true";
}
function containsChinese(title) {
    return /[\u4e00-\u9fa5]/.test(title);
}
var Bot = /** @class */ (function () {
    function Bot(context, config, log) {
        this.context = context;
        this.config = config;
        this.log = log;
    }
    /**
     * 回复指定 Labeled
     */
    Bot.prototype.replyLabeled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configs, label, issue, opener, config, issueComment, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configs = this.config.issue.labeledReplay;
                        if (!configs)
                            return [2 /*return*/];
                        label = this.context.payload.label.name;
                        issue = this.context.payload.issue;
                        opener = issue.user.login;
                        config = configs.find(function (e) { return e.labels.includes(label); });
                        if (!config) return [3 /*break*/, 4];
                        this.log.trace({
                            issue: issue,
                            label: label,
                        }, "replying labeled...");
                        issueComment = this.context.issue({
                            body: string_template_1.default(config.replay, { user: opener }),
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.context.github.issues.createComment(issueComment)];
                    case 2:
                        _a.sent();
                        this.log.info({
                            issue: issue,
                            label: label,
                            issueComment: issueComment,
                        }, "replyed by label.");
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.log.error({
                            issue: issue,
                            label: label,
                            issueComment: issueComment,
                            error: new Error(e_1),
                        }, "reply error!");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 回复翻译
     */
    Bot.prototype.replyTranslate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, issue, body, title, content, issueComment, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = this.config.issue.translate;
                        issue = this.context.payload.issue;
                        if (!containsChinese(issue.title)) return [3 /*break*/, 6];
                        return [4 /*yield*/, translate(issue.body.replace(/<!--(.*?)-->/g, ""), {
                                from: "zh-CN",
                                to: "en",
                            })];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, translate(issue.title, { from: "zh-CN", to: "en" })];
                    case 2:
                        title = _a.sent();
                        if (!(body.text && title.text)) return [3 /*break*/, 6];
                        content = string_template_1.default(config.replay, {
                            title: title.text,
                            body: body.text,
                        });
                        issueComment = this.context.issue({ body: content });
                        this.log.trace({
                            issue: issue,
                            issueComment: issueComment,
                        }, "translating issue...");
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.context.github.issues.createComment(issueComment)];
                    case 4:
                        _a.sent();
                        this.log.info({
                            issue: issue,
                            issueComment: issueComment,
                        }, "translated issue.");
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        this.log.error({
                            error: new Error(e_2),
                            issue: issue,
                            issueComment: issueComment,
                        }, "translate issue error!");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 回复需要重现链接
     */
    Bot.prototype.replyNeedReproduce = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, label, issue, opener, issueComment, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = this.config.issue.needReproduce;
                        label = this.context.payload.label.name;
                        issue = this.context.payload.issue;
                        opener = issue.user.login;
                        if (!new RegExp(config.label).test(label)) return [3 /*break*/, 6];
                        issueComment = this.context.issue({
                            body: string_template_1.default(config.replay, { user: opener }),
                        });
                        this.log.trace({
                            issue: issue,
                            label: label,
                        }, "replying `NeedReproduce` issue...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.context.github.issues.createComment(issueComment)];
                    case 2:
                        _a.sent();
                        if (!config.afterLabel) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.context.github.issues.addLabels(this.context.issue({ labels: [config.afterLabel] }))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.log.info({
                            issue: issue,
                            label: label,
                            issueComment: issueComment,
                        }, "replyed `NeedReproduce` issue.");
                        return [3 /*break*/, 6];
                    case 5:
                        e_3 = _a.sent();
                        this.log.error({
                            error: new Error(e_3),
                            issue: issue,
                            label: label,
                            issueComment: issueComment,
                        }, "reply `NeedReproduce` issue error!");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 回复所有非 ng-alain-issue-help 创建的 Issues
     */
    Bot.prototype.replyInvalid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, isMember, issue, opener, mark, labels, issueComment, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = this.config.issue.invalid;
                        return [4 /*yield*/, this.isMember()];
                    case 1:
                        isMember = _a.sent();
                        issue = this.context.payload.issue;
                        opener = issue.user.login;
                        mark = config.mark;
                        labels = [];
                        if (Array.isArray(config.labels)) {
                            labels = config.labels;
                        }
                        else {
                            labels = [config.labels];
                        }
                        if (!(!issue.body.includes(mark) && !isMember)) return [3 /*break*/, 7];
                        issueComment = this.context.issue({
                            body: string_template_1.default(config.replay, { user: opener }),
                        });
                        this.log.trace({
                            issue: issue,
                        }, "replying Invalid issue...");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.context.github.issues.createComment(issueComment)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.context.github.issues.update(this.context.issue({ state: "closed" }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.context.github.issues.addLabels(this.context.issue({ labels: labels }))];
                    case 5:
                        _a.sent();
                        this.log.info({
                            issue: issue,
                        }, "replyed invalid issue...");
                        return [3 /*break*/, 7];
                    case 6:
                        e_4 = _a.sent();
                        this.log.error({
                            error: new Error(e_4),
                            issue: issue,
                        }, "reply invalid issue error!");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.isMember = function () {
        return __awaiter(this, void 0, void 0, function () {
            var members, issue, opener;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (isDev()) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.getMembers()];
                    case 1:
                        members = _a.sent();
                        issue = this.context.payload.issue;
                        opener = issue.user.login;
                        return [2 /*return*/, members.includes(opener)];
                }
            });
        });
    };
    Bot.prototype.getMembers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var members, repo, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        members = [];
                        repo = this.context.repo();
                        return [4 /*yield*/, this.context.github.orgs.listMembers({
                                org: repo.owner,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response && response.data) {
                            members = response.data;
                        }
                        return [2 /*return*/, members.map(function (m) { return m.login; })];
                }
            });
        });
    };
    return Bot;
}());
exports.Bot = Bot;
