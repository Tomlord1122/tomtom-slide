---
theme: seriph
themeConfig:
  primary: '#323232' # dark: 323232, white: 101828
background: /background.webp
title: Temporal Introduction
info: |
  ## Starter Template
  A Durable Execution Platform that help orchestrate microservice
class: text-center
drawings:
  persist: true
transition: slide-left
mdc: true
highlighter: shiki
lineNumbers: true
colorSchema: light
---

<style>
.slidev-layout {
  background: linear-gradient(-45deg,rgb(37, 51, 37), #EAEAEA);
  background-size: 400% 400%;
}
</style>


# Temporal Introduction

A Durable Execution Platform that help orchestrate microservice
<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer " hover="bg-white bg-opacity-10">
    Press Space to continue <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-tl m-6">
  <a href="https://tomlord.fyi" target="_blank" title="Visit my website">
    <img src="/Avatar.png" class="w-16 h-16 rounded-full" alt="Avatar" />
  </a>
</div>

<div class="abs-bl m-6">
  <a href="https://tomlord.fyi" target="_blank" title="Visit my website">
    <img src="/tm.webp" class="w-full h-12" alt="trend micro" />
  </a>
</div>

<div class="abs-br m-6 flex gap-2 items-center">
  <a href="https://github.com/Tomlord1122" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---

# Outline
<div class="text-2xl">
<li v-click="1">Flow Service in Nutshell</li>
<li v-click="1">Design Consideration</li>
<li v-click="2">Temporal Introduction</li>
<li v-click="2">Event History Example</li>
<li v-click="3">Refactor AI-FP Flow</li>
<li v-click="3">Argo Workflow vs. Airflow vs. Temporal</li>
</div>


---
layout: image-right
image: /flow-service.png
backgroundSize: cover
---

##  Flow Service in Nutshell

<div v-click="1" class="mb-3 mt-3">

- The core service of the Email Close Loop project, an **orchestration microservice** designed to coordinate and streamline complex submission case workflows **across multiple backend services**:
  
</div>

<div v-click="2">

  1. **Email Scan Service**
  2. **LLM Confidence Analyzer Service**
  3. **LLM Reasoning Analyzer Service**
  4. **Remediation Service**
  5. **Solve Service**
  6. **Custom Rule**
  7. **Whitelist Provider**
  8. **DB Manager Service**

</div>

---
layout: image-right
image: /fn-flow.png
backgroundSize: contain
---

# Design Consideration


Currently, Flow Service handles three flows:

1. FN Flow
2. FP Flow
3. AgenticAI FP Flow


<div v-click>

Designing robust **error handling**, **retry mechanisms**, and **flow-state management** is therefore critical. Currently, the flow service does not implement these capabilities. 

</div>

<div v-click="1">

<span v-mark.underline.red="2">Which tool can satisfy our requirements?</span>

</div>

---

<div>

# Temporal Intro

Temporal is an **open-source durable execution platform** originally created by former Uber engineers. It solves the complexity of building reliable distributed systems by providing:

- **Automatic state management**: Your <span v-mark.underline.red>workflow state is automatically persited</span>
- **Failure recover**: <span v-mark.underline.red>Automatic retries</span> and recovery from failures
- **Long-running workflows**: Provide some pattern to support for workflows that run for hours, days, or even months.
- **Visibility**: Built-in observability into workflow execution

<div v-click class="flex justify-between">
<img src="/temporal_logo.png" class="w-1/3"/>
</div>
</div>

---

<div>

# Architecture Overview

Temporal High-Level Architecture and it's execution flow.

<code v-click="1">go get go.temporal.io/sdk</code>
<div v-click="2" class="text-gray-600"><span v-mark.circle.orange="3">What's Temporal Workflow and Temporal Activity?</span></div>

<div class="flex justify-between gap-2">
<img src="/temporal_arch.png" class="w-124 h-full object-contain"/>
<img src="/execution_flow.png" class="w-96 h-full object-contain"/>
</div>
</div>




---

# Temporal Workflow

A **Workflow** is a durable function that orchestrates **Activities**. Think of it as your business logic coordinator.

1. Must be deterministic (same inputs = same outputs)
2. Automatically retried on failure
3. State is preserved across crashes

<div class="flex justify-between items-center gap-2">

<div v-click>

```go
// Workflow Definition
func ExampleWorkflow(ctx workflow.Context, input Input) (string, error) {
    // It coordinates Activities but doesn't do the actual work
}

```
</div>
<img v-click src="/workflow_flow.png" class="w-1/3 h-full">
</div>

---

# Temporal Activity

An **Activity** is **a single, well-defined action** (like **calling an API**, database operation, or sending an email). In our case, Temporal Activity should be lots of close-loop microservice call.
<div class="flex gap-4">
<div class="w-1/2">
<div class="flex flex-col">
<span>1. Can be non-deterministic</span>
<span>2. Execute actual business logic</span>
<span>3. Can be retried independetly</span>
</div >
<span v-click>

```go
func (a *exampleActivity) Activity1(ctx context.Context, input Input) (string, error){
  // Actual business logic here
  // Can call external APIs, databases, etc
}
```
</span>
</div >
<img v-click src="/activity_flow.png" class="w-1/2 object-contain h-full"/>
</div>


---

# Temporal Code Example

````md magic-move
```go {1-4|6-19|all}

// Workflow Definition
func ExampleWorkflow(ctx workflow.Context, input Input) (string, error) {
    // It coordinates Activities but doesn't do the actual work
}

// Activity Definition (1, 2, 3)
func (a *exampleActivity) Activity1(ctx context.Context, input Input) (string, error){
  // Actual business logic here
  // Can call external APIs, databases, etc
}

func (a *exampleActivity) Activity2(ctx context.Context, input Input) (string, error){
  // Do something
}

func (a *exampleActivity) Activity3(ctx context.Context, input Input) (string, error){
  // Do something
}

```

```go

func ExampleWorkflow(ctx workflow.Context, input Input) (string, error) {
    // It coordinates Activities but doesn't do the actual work
    err := workflow.ExecuteActivity(ctx, Activity1, Input).Get(ctx, &activity1Result)
    if err != nil{
      // Do something
    }
    err := workflow.ExecuteActivity(ctx, Activity2, Input).Get(ctx, &activity2Result)
    if err != nil{
      // Do something
    }
    err := workflow.ExecuteActivity(ctx, Activity3, Input).Get(ctx, &activity3Result)
    if err != nil{
      // Do something
    }
    return "sucess", nil
}

```

```go

func ExampleWorkflow(ctx workflow.Context, input Input) (string, error) {
    // It coordinates Activities but doesn't do the actual work
    // Configure activity options with retry policy
    activityOptions := workflow.ActivityOptions{
      StartToCloseTimeout: 30 * time.Second,
      RetryPolicy: &temporal.RetryPolicy{
        InitialInterval:        time.Second,     // Start with 1s delay
        BackoffCoefficient:     2.0,             // Double the interval each time
        MaximumInterval:        5 * time.Second, // Cap at 5s between retries
        MaximumAttempts:        4,
        NonRetryableErrorTypes: []string{
          // Add non-retryable error types here if needed
        },
      },
    }

    ctx = workflow.WithActivityOptions(ctx, activityOptions)

    err := workflow.ExecuteActivity(ctx, Activity1, Input).Get(ctx, &activity1Result)
    if err != nil{
      // Do something
    }
    // remaining part...
}


```
````


---

# Signal Pattern


In our use case, some tasks require waiting for a service response for an extended period. We currently handle this with a callback flow: the external service calls the flow service to signal that the work is complete.

With Temporal, we can use its Signal pattern. It’s a good fit and integrates cleanly with our current implementation.

Link:
[Temporal Signal Pattern](https://docs.temporal.io/handling-messages)


---

# Event-History Example

<div class="relative w-full h-full">
  <img v-click src="/commands-events.002.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.003.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.004.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.005.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.006.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.007.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.008.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.009.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.010.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.011.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.012.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.013.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
  <img v-click src="/commands-events.014.jpeg" class="absolute inset-0 w-full h-full object-contain"/>
</div>


---

# Refactor Flow (AI-FP)

<div class="flex h-full w-full justify-between items-center">
<img v-click src="/current_ai_fp.png" class="w-2/5 h-full object-contain"/>
<img v-click src="/aifp_temporal.png" class="w-3/5 h-full object-contain"/>
</div>

---

## Argo Workflow vs. Airflow vs. Temporal

<div class="text-xs">

| **Requirement** | Temporal | Argo Workflows | Airflow |
|-------------|:--------:|:--------------:|:-------:|
| Per-step retry with timeouts/backoff | ✅ | ⚠️ | ✅ |
| Durable state & event history | ✅ | ⚠️ | ⚠️ |
| Observability & visibility | ✅ | ✅ | ✅ |
| Event-driven | ✅ | ⚠️ | ⚠️ |
| Batch ETL | ⚠️ | ✅ | ✅ |
| Concurrency control | ✅ | ⚠️ | ⚠️ |
| Kubernetes-native parallel compute | ⚠️ | ✅ | ⚠️ |
| Go support (SDK/authoring) | ✅ | ✅ | ⚠️ |

</div>

<div class="text-sm mt-4 opacity-100">

✅ = Native support &nbsp;&nbsp; ⚠️ = Partial / requires custom implementation
<div v-click="1">With <span v-mark.highlight.yellow="2">a mature Go SDK</span> and an <span v-mark.highlight.yellow="2">architecture that aligns well with our codebase</span>, Temporal seems like a good choice.</div>
</div>

