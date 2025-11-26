-- Create leads table for tracking user inquiries
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Lead Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,

    -- Project Details
    project_timeline TEXT, -- 'immediate', 'within_month', 'within_3months', 'planning'
    property_type TEXT, -- 'single_family', 'multi_family', 'commercial'
    charger_type TEXT, -- 'level2', 'tesla', 'both', 'unsure'
    electrical_panel_upgrade BOOLEAN DEFAULT false,

    -- Lead Source & Tracking
    source TEXT DEFAULT 'website', -- 'website', 'google', 'facebook', 'referral'
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_address INET,
    user_agent TEXT,

    -- Lead Status
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    assigned_to BIGINT[], -- Array of installer IDs this lead was sent to
    notes TEXT,

    -- Conversion Tracking
    converted BOOLEAN DEFAULT false,
    converted_at TIMESTAMP WITH TIME ZONE,
    conversion_value DECIMAL(10, 2),
    selected_installer_id BIGINT REFERENCES public.installers(id)
);

-- Create email_logs table for tracking outreach
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Email Details
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    template_used TEXT,

    -- Tracking
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,

    -- Relations
    lead_id UUID REFERENCES public.leads(id),
    installer_id BIGINT REFERENCES public.installers(id),

    -- Error Tracking
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Email Provider Data
    provider TEXT DEFAULT 'sendgrid', -- 'sendgrid', 'mailgun', 'ses', 'smtp'
    provider_message_id TEXT,
    provider_response JSONB
);

-- Create installer_reviews table
CREATE TABLE IF NOT EXISTS public.installer_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    installer_id BIGINT REFERENCES public.installers(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id),

    -- Review Data
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    reviewer_name TEXT,
    reviewer_email TEXT,

    -- Verification
    verified BOOLEAN DEFAULT false,
    google_review_id TEXT,

    -- Display Control
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false
);

-- ... (skipping unchanged parts) ...

-- Create function to assign leads to installers
CREATE OR REPLACE FUNCTION assign_lead_to_installers(
    p_lead_id UUID,
    p_max_installers INTEGER DEFAULT 3
)
RETURNS BIGINT[] AS $$
DECLARE
    v_lead RECORD;
    v_installer_ids BIGINT[];
BEGIN
    -- Get lead details
    SELECT * INTO v_lead FROM public.leads WHERE id = p_lead_id;

    -- Find matching installers
    SELECT ARRAY_AGG(id) INTO v_installer_ids
    FROM (
        SELECT id
        FROM public.installers
        WHERE
            city = v_lead.city
            AND state = v_lead.state
            AND active = true
            AND verified = true
        ORDER BY
            featured DESC,
            rating DESC NULLS LAST,
            review_count DESC NULLS LAST
        LIMIT p_max_installers
    ) AS matching_installers;

    -- Update lead with assigned installers
    UPDATE public.leads
    SET assigned_to = v_installer_ids
    WHERE id = p_lead_id;

    RETURN v_installer_ids;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (commented out for production)
-- INSERT INTO public.leads (full_name, email, phone, city, state, project_timeline, property_type, charger_type)
-- VALUES
-- ('John Smith', 'john@example.com', '555-1234', 'San Francisco', 'CA', 'immediate', 'single_family', 'tesla'),
-- ('Jane Doe', 'jane@example.com', '555-5678', 'Los Angeles', 'CA', 'within_month', 'single_family', 'level2');