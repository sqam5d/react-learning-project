import { ExamList, ExamTopicListDateType, ExamTopicType, getExamTopic, getExamTopicListById, getSubjectTree, getTopic, postExamList, SubjectTreeType, TopicData } from '@/util/request'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'

type Data = {
  loading: boolean
  exam_list_data: {
    list: []
    count: number
    limit: number
    current_page: number
    skip: number
    search_params: {}
  }
  subject_tree: SubjectTreeType[]
  subject_two_active: {
    value: string
    title: string
  }
  topic_list: TopicData[]
  active_topic: TopicData
  current_exam_topic_id: string
  exam_topic_list: ExamTopicListDateType[]
  current_subject_two: SubjectTreeType
}

const initialState: Data = {
  loading: false,
  // 阅卷列表数据
  exam_list_data: {
    list: [],
    count: 0,
    limit: 10,
    current_page: 1,
    skip: 0,
    search_params: {}
  },
  // 课程树型结构
  subject_tree: [],
  // 树型结构中二级课程的高亮
  subject_two_active: {
    value: '',
    title: ''
  },
  // 题目列表
  topic_list: [],
  // 被选中的题目
  active_topic: {} as TopicData,
  // 现在当前试卷的学生ID
  current_exam_topic_id: '',
  // 阅卷，查看或者答题试卷时候的列表
  exam_topic_list: [] as ExamTopicListDateType[],
  // 被选中的二级课程
  current_subject_two: {} as SubjectTreeType
}

// 获取阅卷列表 action是dispatch传过来的参数 第一个是extraReducers中res.payload的数据类型 第二个any对应传过来的参数 createAsyncThunk<any, any>
export const get_exam_list_async = createAsyncThunk<any, any>('get/exam_list', async (action, state) => {
  return await postExamList(action)
})

// 获取课程的树型结构
export const get_subject_tree_async = createAsyncThunk<SubjectTreeType[]>('get/subject_tree', async (action, state) => {
  return await getSubjectTree()
})

// 根据二级课程的id获取题目
export const get_topic_list_async = createAsyncThunk<TopicData[], string>('get/topic_list', async (action, state) => {
  return await getTopic(action)
})

// 获取阅卷，查看或者答题试卷时候的列表
export const get_exam_topic_list_async = createAsyncThunk<ExamTopicType, string>('get/exam_topic_list', async (action, state) => {
  return await getExamTopicListById(action)
})

// 学生获取试卷题目
export const get_student_exam_topic_list_async = createAsyncThunk<ExamTopicListDateType[], string>('get/student_exam_topic_list', async (action, state) => {
  return await getExamTopic(action)
})

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    // 修改阅卷列表的数据
    set_exam_list_data: (state, action) => {
      state.exam_list_data = {
        ...state.exam_list_data,
        ...action.payload
      }
    },
    // 设置树型选择中二级课程的高亮
    set_subject_two_active: (state, action) => {
      state.subject_two_active = action.payload
    },
    // 被选中的题目
    set_active_topic: (state, action) => {
      state.active_topic = action.payload
    },
    // 修改学生ID
    set_current_exam_topic_id: (state, action) => {
      state.current_exam_topic_id = action.payload
    },
    // 阅卷时候的批阅添加的批阅，通过等信息
    set_corret_exam_topic_list: (state, action) => {
      state.exam_topic_list.forEach((item: any) => {
        if (item._id === action.payload._id) {
          item.pass = action.payload.pass
          item.comment = action.payload.comment
          item.is_corret = action.payload.is_corret
        }
      })
    },
    // 设置当前被选中的二级课程
    set_current_subject_two: (state, action) => {
      state.current_subject_two = action.payload
    },
    // 答题时候的答案
    set_answer_exam_topic_list: (state, action) => {
      state.exam_topic_list.forEach((item: ExamTopicListDateType) => {
        if (item._id === action.payload._id) {
          item.answer = action.payload.answer
        }
      })
    },
    // 清空考试题目
    set_clear_exam_topic_list: (state, action) => {
      state.exam_topic_list = action.payload
    }
  },
  extraReducers: builder => {
    builder
      // 阅卷列表的数据
      .addCase(get_exam_list_async.pending, (state, res) => {
        state.loading = true
      })
      .addCase(get_exam_list_async.fulfilled, (state, res) => {
        state.exam_list_data.list = res.payload.data
        state.exam_list_data.count = res.payload.count
        state.loading = false
      })
      // 获取树型选择器中的课程
      .addCase(get_subject_tree_async.fulfilled, (state, res) => {
        state.subject_tree = res.payload
      })
      .addCase(get_topic_list_async.pending, (state, res) => {
        state.loading = true
      })
      // 获取题目列表
      .addCase(get_topic_list_async.fulfilled, (state, res) => {
        state.topic_list = res.payload
        state.loading = false
      })
      // 根据试卷ID获取题目列表
      .addCase(get_exam_topic_list_async.fulfilled, (state, res) => {
        state.exam_topic_list = res.payload.topic_list
        state.current_exam_topic_id = res.payload.topic_list[0]._id
      })
      // 学生获取试卷题目
      .addCase(get_student_exam_topic_list_async.fulfilled, (state, res) => {
        state.exam_topic_list = res.payload
        // 因为进去要默认显示第一个，所以获取第一个题目的id
        state.current_exam_topic_id = res.payload[0]._id
      })
  }
})

// 查询阅卷列表
export const select_exam_list_data = (state: RootState) => {
  return state.subject.exam_list_data
}

// 加载效果
export const select_subject_loading = (state: RootState) => {
  return state.subject.loading
}

// 查询树型结构
export const select_subject_tree = (state: RootState) => {
  return state.subject.subject_tree
}

// 查询树型选择器中高亮的二级题目
export const select_subject_two_active = (state: RootState) => {
  return state.subject.subject_two_active
}

// 查询题目列表
export const select_topic_list = (state: RootState) => {
  return state.subject.topic_list
}

// 查询被选中的题目
export const select_active_topic = (state: RootState) => {
  return state.subject.active_topic
}

// 获取当前试卷中选中题目的id
export const select_current_exam_topic_id = (state: RootState) => {
  return state.subject.current_exam_topic_id
}

// 查询阅卷列表中某用户的答题列表或者题目列表
export const select_exam_topic_list = (state: RootState) => {
  return state.subject.exam_topic_list
}

//查询现在选中考题的各种信息
export const select_current_exam_topic_data = (state: RootState) => {
  return state.subject.exam_topic_list.find(item => {
    return state.subject.current_exam_topic_id === item._id
  })
}

// 查询选中的二级课程
export const select_current_subject_two = (state: RootState) => {
  return state.subject.current_subject_two
}

export const { set_exam_list_data, set_subject_two_active, set_active_topic, set_current_exam_topic_id, set_corret_exam_topic_list, set_current_subject_two, set_answer_exam_topic_list, set_clear_exam_topic_list } = subjectSlice.actions

export default subjectSlice.reducer
