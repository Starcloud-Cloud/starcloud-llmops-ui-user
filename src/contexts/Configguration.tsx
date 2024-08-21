import { createContext, useContext } from 'react';

const DebugConfigurationContext = createContext<any>({
    appId: '',
    isAPIKeySet: false,
    isTrailFinished: false,
    mode: '',
    modelModeType: 'chat',
    promptMode: 'simple',
    setPromptMode: () => {},
    isAdvancedMode: false,
    isAgent: false,
    isFunctionCall: false,
    isOpenAI: false,
    collectionList: [],
    canReturnToSimpleMode: false,
    setCanReturnToSimpleMode: () => {},
    chatPromptConfig: {
        prompt: [
            {
                role: 'system',
                text: ''
            }
        ]
    },
    completionPromptConfig: {
        prompt: {
            text: ''
        },
        conversation_histories_role: {
            user_prefix: '',
            assistant_prefix: ''
        }
    },
    currentAdvancedPrompt: [],
    showHistoryModal: () => {},
    conversationHistoriesRole: {
        user_prefix: 'user',
        assistant_prefix: 'assistant'
    },
    setConversationHistoriesRole: () => {},
    setCurrentAdvancedPrompt: () => {},
    hasSetBlockStatus: {
        context: false,
        history: false,
        query: false
    },
    conversationId: '',
    setConversationId: () => {},
    introduction: '',
    setIntroduction: () => {},
    suggestedQuestions: [],
    setSuggestedQuestions: () => {},
    controlClearChatMessage: 0,
    setControlClearChatMessage: () => {},
    prevPromptConfig: {
        prompt_template: '',
        prompt_variables: []
    },
    setPrevPromptConfig: () => {},
    moreLikeThisConfig: {
        enabled: false
    },
    setMoreLikeThisConfig: () => {},
    suggestedQuestionsAfterAnswerConfig: {
        enabled: false
    },
    setSuggestedQuestionsAfterAnswerConfig: () => {},
    speechToTextConfig: {
        enabled: false
    },
    setSpeechToTextConfig: () => {},
    textToSpeechConfig: {
        enabled: false,
        voice: '',
        language: ''
    },
    setTextToSpeechConfig: () => {},
    citationConfig: {
        enabled: false
    },
    setCitationConfig: () => {},
    moderationConfig: {
        enabled: false
    },
    annotationConfig: {
        id: '',
        enabled: false,
        score_threshold: 0.9,
        embedding_model: {
            embedding_model_name: '',
            embedding_provider_name: ''
        }
    },
    setAnnotationConfig: () => {},
    setModerationConfig: () => {},
    externalDataToolsConfig: [],
    setExternalDataToolsConfig: () => {},
    formattingChanged: false,
    setFormattingChanged: () => {},
    inputs: {},
    setInputs: () => {},
    query: '',
    setQuery: () => {},
    completionParams: {
        max_tokens: 16,
        temperature: 1, // 0-2
        top_p: 1,
        presence_penalty: 1, // -2-2
        frequency_penalty: 1 // -2-2
    },
    setCompletionParams: () => {},
    modelConfig: {
        provider: 'OPENAI', // 'OPENAI'
        model_id: 'gpt-3.5-turbo', // 'gpt-3.5-turbo'
        mode: 'unset',
        configs: {
            prompt_template: '',
            prompt_variables: []
        },
        opening_statement: null,
        more_like_this: null,
        suggested_questions_after_answer: null,
        speech_to_text: null,
        text_to_speech: null,
        retriever_resource: null,
        sensitive_word_avoidance: null,
        dataSets: [],
        agentConfig: {
            enabled: false,
            max_iteration: 5,
            strategy: 'function_call',
            tools: []
        }
    },
    setModelConfig: () => {},
    dataSets: [],
    showSelectDataSet: () => {},
    setDataSets: () => {},
    datasetConfigs: {
        retrieval_model: 'multiWay',
        reranking_model: {
            reranking_provider_name: '',
            reranking_model_name: ''
        },
        top_k: 2,
        score_threshold_enabled: false,
        score_threshold: 0.7,
        datasets: {
            datasets: []
        }
    },
    setDatasetConfigs: () => {},
    hasSetContextVar: false,
    isShowVisionConfig: false,
    visionConfig: {
        enabled: false,
        number_limits: 2,
        detail: 'low',
        transfer_methods: 'remote_url'
    },
    setVisionConfig: () => {},
    rerankSettingModalOpen: false,
    setRerankSettingModalOpen: () => {}
});

export const useDebugConfigurationContext = () => useContext(DebugConfigurationContext);

export default DebugConfigurationContext;
