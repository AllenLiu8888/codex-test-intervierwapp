# 阶段 D：共用表单与 CRUD 逻辑

## 操作步骤
1. 在 `src/components/forms/InterviewForm.jsx` 编写通用表单组件：
   - 使用受控输入管理 Title、Job Role、Description、Status 字段；
   - 通过 `onSubmit` 回调向页面层返回表单数据，统一处理创建/更新；
   - 在 `useEffect` 中侦听 `initialValues`，进入编辑模式时回显原数据。
2. 在 `src/pages/interviews/InterviewEditorPage.jsx` 中根据 URL 参数判断是新增还是编辑，分别调用 `createInterview` 或 `updateInterview`，并在保存成功后通过 `useNavigate` 返回列表。
3. 在 `src/components/forms/QuestionForm.jsx` 中实现面试题表单，提供 Question、Difficulty 选择器，重用 `interviewId` 作为隐藏字段。
4. 在 `src/pages/questions/QuestionEditorPage.jsx` 内使用上述表单组件，结合 `listInterviews` 供下拉选择，保存时调用 `createQuestion` / `updateQuestion` 并刷新列表。
5. 在 `src/components/forms/ApplicantForm.jsx` 中实现候选人表单：
   - 维护 Title、Firstname、Surname、Phone、Email、Interview Status 字段；
   - 加入对 `buildApplicantLink` 的说明，保存后由页面生成邀请链接。
6. 在 `src/pages/applicants/ApplicantEditorPage.jsx` 中根据路由参数加载候选人详情，保存后调用 `createApplicant` 或 `updateApplicant`，完成后跳转回候选人列表。
7. 更新列表页中的按钮逻辑：
   - `src/pages/interviews/InterviewsPage.jsx`、`src/pages/questions/QuestionsPage.jsx`、`src/pages/applicants/ApplicantsPage.jsx` 添加 “Edit”/“Delete”/“New” 按钮并绑定到各自的编辑页面或删除方法；
   - 删除操作调用对应的 `deleteInterview`、`deleteQuestion`、`deleteApplicant`，并在成功后 `refetch()`。

## 交付结果
- 所有新增与编辑页面都通过共享表单组件实现，避免重复 JSX，满足 `/rules/frontend.md` 的 DRY 要求。
- 列表页与表单页形成完整 CRUD 闭环，用户可新增、编辑、删除面试、题目与候选人。
