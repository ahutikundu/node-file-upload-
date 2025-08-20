const utility = require("./helpers/utility.js");

exports.getAllViewsController = async function (req, res) {
    try {
        const { account_Id, module_Id, search, type } = req.query;

        // ==================== VALIDATION ====================
        if (utility.checkEmpty(module_Id)) {
            return await sendError(res, req, "module_Id is required.");
        }

        // ==================== MOCK DATA ====================
        const mockModuleItem = {

            module_Id: parseInt(module_Id),

            account_Id: account_Id || 1,

            module_Name: "HRMS",

            module_Slug: "hrms",

            module_Order: 2,

            is_active: 1,

            is_delete: 0,

            created_at: "2025-06-29 20:23:43",

            updated_at: "2025-07-29 11:23:24",

            deleted_at: null

        };

        const mockLists = [

            {

                list_Id: 29,

                list_Name: "hthrgszr",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-04 11:02:22",

                updated_at: "2025-08-04 11:02:22",

                is_active: 1

            },

            {

                list_Id: 28,

                list_Name: "test",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-04 10:59:36",

                updated_at: "2025-08-04 10:59:36",

                is_active: 1

            },

            {

                list_Id: 26,

                list_Name: "Testing API",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-04 10:56:27",

                updated_at: "2025-08-04 10:56:27",

                is_active: 1

            },

            {

                list_Id: 27,

                list_Name: "Tesyt",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-04 10:57:48",

                updated_at: "2025-08-04 09:58:12",

                is_active: 0

            },

            {

                list_Id: 24,

                list_Name: "Test",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-02 06:57:15",

                updated_at: "2025-08-02 18:24:45",

                is_active: 1

            },

            {

                list_Id: 25,

                list_Name: "Test1111",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-02 16:20:25",

                updated_at: "2025-08-02 18:20:15",

                is_active: 0

            },

            {

                list_Id: 23,

                list_Name: "Test1111",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-02 06:55:27",

                updated_at: "2025-08-02 06:55:27",

                is_active: 1

            },

            {

                list_Id: 22,

                list_Name: "Test0058",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-02 06:39:12",

                updated_at: "2025-08-02 06:39:12",

                is_active: 1

            },

            {

                list_Id: 21,

                list_Name: "Test0058",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-01 20:30:59",

                updated_at: "2025-08-01 20:30:59",

                is_active: 1

            }

        ];

        const mockForms = [

            {

                form_Id: 72,

                form_Name: "data entry form 2nd aug",

                form_Type: "create",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-02 09:52:59",

                updated_at: "2025-08-02 19:17:18",

                is_active: 1

            },

            {

                form_Id: 70,

                form_Name: "Data entry form test",

                form_Type: "create",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-01 13:33:31",

                updated_at: "2025-08-01 16:17:19",

                is_active: 1

            },

            {

                form_Id: 71,

                form_Name: "data editing form",

                form_Type: "edit",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-01 16:21:39",

                updated_at: "2025-08-01 16:16:49",

                is_active: 1

            },

            {

                form_Id: 69,

                form_Name: "Data entry form test",

                form_Type: "create",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-01 13:32:19",

                updated_at: "2025-08-01 13:32:19",

                is_active: 1

            },

            {

                form_Id: 68,

                form_Name: "Data entry form test",

                form_Type: "create",

                account_Id: 1,

                module_Id: parseInt(module_Id),

                created_at: "2025-08-01 13:32:11",

                updated_at: "2025-08-01 13:32:11",

                is_active: 1

            }

        ];

        // ==================== APPLY FILTERS ====================
        let filteredLists = mockLists;
        let filteredForms = mockForms;

        if (!utility.checkEmpty(account_Id)) {
            filteredLists = filteredLists.filter(list => list.account_Id == account_Id);
            filteredForms = filteredForms.filter(form => form.account_Id == account_Id);
        }

        // ==================== TRANSFORM DATA ====================
        const listViewPayload = filteredLists.map((list) => ({
            list_Name: list.list_Name,
            list_Id: list.list_Id,
            type: "List",
            created_at: list.created_at,
            updated_at: list.updated_at,
            is_active: list.is_active
        }));

        const formViewPayload = filteredForms.map((form) => ({
            list_Name: form.form_Name,
            list_Id: form.form_Id,
            type: form.form_Type === "create" ? "Create-form" : "Edit-form",
            created_at: form.created_at,
            updated_at: form.updated_at,
            is_active: form.is_active
        }));

        // ==================== COMBINE, SEARCH & SORT ====================
        let combinedList = [...listViewPayload, ...formViewPayload];

        // Apply search and type filters
        if (!utility.checkEmpty(search)) {
            const searchLower = search.toLowerCase();
            combinedList = combinedList.filter(item =>
                item.list_Name.toLowerCase().includes(searchLower)
            );
        }

        if (!utility.checkEmpty(type)) {
            combinedList = combinedList.filter(item =>
                item.type.toLowerCase() === type.toLowerCase()
            );
        }

        // Sort by updated/created time
        combinedList.sort((a, b) => {
            const timeA = new Date(a.updated_at || a.created_at).getTime();
            const timeB = new Date(b.updated_at || b.created_at).getTime();
            return timeB - timeA;
        });

        // ==================== RETURN RESPONSE ====================
        return await sendSuccess(
            res,
            req,
            {
                lists: combinedList,
                moduleItem: mockModuleItem
            },
            "Lists fetched successfully."
        );

    } catch (error) {
        console.error("Error in getAllViewsController:", error);
        return await sendError(
            res,
            req,
            "An unexpected error occurred while fetching lists.",
            error?.message
        );
    }
};

/**
 * Success response helper
 */
const sendSuccess = async (res, req, data = {}, message = "Operation successful", statusCode = 200) => {
    try {
        const response = {
            status: "success",
            msg: message,
            data: data,
            timestamp: new Date().toISOString(),
        };

        if (process.env.NODE_ENV !== 'production') {
            console.log(`✅ SUCCESS [${req.method} ${req.originalUrl}]:`, {
                statusCode,
                message,
                dataKeys: Object.keys(data)
            });
        }

        return res.status(statusCode).json(response);
    } catch (error) {
        console.error('Error in sendSuccess helper:', error);
        return res.status(500).json({
            status: "error",
            msg: "Failed to format success response",
            error: error.message
        });
    }
};

/**
 * Error response helper
 */
const sendError = async (res, req, message = "An error occurred", details = null, statusCode = 400) => {
    try {
        const response = {
            status: "error",
            msg: message,
            timestamp: new Date().toISOString(),
        };

        if (details && process.env.NODE_ENV !== 'production') {
            response.details = details;
            response.path = req.originalUrl;
            response.method = req.method;
        }

        console.error(`❌ ERROR [${req.method} ${req.originalUrl}]:`, {
            statusCode,
            message,
            details,
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress
        });

        return res.status(statusCode).json(response);
    } catch (error) {
        console.error('Error in sendError helper:', error);
        return res.status(500).json({
            status: "error",
            msg: "Critical server error",
            timestamp: new Date().toISOString()
        });
    }
};
