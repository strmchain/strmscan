<template>
    <div
        v-if="loading"
        :class="(loading ? 'strm-loading strm-loading--full' : '')"/>
    <section v-else>
        <div class="card strm-card strm-card--verify">
            <div class="strm-card__header">
                <h3 class="strm-card__headline">Download Data</h3>
                <p>The information you requested can be downloaded from this page.
                    Export the earliest 1000 records.</p>
            </div>
            <div class="strm-card__body">
                <form
                    :class="loadingForm ? 'strm-loading strm-loading--form' : ''"
                    novalidate
                    @submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-4">
                            <div class="form-group">
                                <label>From Block</label>
                                <div class="clearfix"/>
                                <input
                                    v-model="fromBlock"
                                    class="form-control"
                                    required="required"
                                    type="number"
                                    placeholder="From Block">
                                <div
                                    v-if="error && errors.fromBlock"
                                    class="text-danger">From Block is required</div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                            <div class="form-group">
                                <label>To Block</label>
                                <div class="clearfix"/>
                                <input
                                    v-model="toBlock"
                                    class="form-control"
                                    required="required"
                                    type="number"
                                    placeholder="To Block">
                                <div
                                    v-if="error && errors.toBlock"
                                    class="text-danger">To Block is required</div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                            <div class="form-group">
                                <label>Type</label>
                                <div class="clearfix"/>
                                <select
                                    id="inputStatus"
                                    v-model="downloadType"
                                    required="required"
                                    name="status"
                                    class="form-control mx-sm-1">
                                    <option
                                        :selected="downloadType === '' ? 'selected' : ''"
                                        value=""
                                        hidden
                                        disabled>Select type</option>
                                    <option
                                        :selected="downloadType === 'IN' ? 'selected' : ''"
                                        value="IN">In Transaction</option>
                                    <option
                                        :selected="downloadType === 'OUT' ? 'selected' : ''"
                                        value="OUT">Out Transaction</option>
                                    <option
                                        :selected="downloadType === 'INTERNAL' ? 'selected' : ''"
                                        value="INTERNAL">Internal Transaction</option>
                                    <option
                                        :selected="downloadType === 'REWARD' ? 'selected' : ''"
                                        value="REWARD">Rewards</option>
                                </select>
                                <div
                                    v-if="error && errors.downloadType"
                                    class="text-danger">Type is required</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <button
                            :disabled="loadingForm"
                            type="submit"
                            class="btn btn-primary mr-1">
                            <i
                                v-if="loadingForm"
                                class="fa fa-cog fa-spin mr-2"/>Download
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
import { validationMixin } from 'vuelidate'
const jwt = require('jsonwebtoken')
const FileDownload = require('js-file-download')

export default {
    components: {},
    mixins: [validationMixin],
    data () {
        return {
            accountAddress: '',
            fromBlock: '',
            toBlock: '',
            error: false,
            errors: {},
            loadingForm: false,
            loading: true,
            downloadType: ''
        }
    },
    async mounted () {
        await this.$recaptcha.init()

        this.loading = true

        // Init breadcrumbs data.
        this.$store.commit('breadcrumb/setItems', { name: 'download', to: { name: 'download' } })

        const address = this.$route.query.address
        if (address) {
            this.accountAddress = address
        }

        this.loading = false
    },
    methods: {
        async onSubmit () {
            if (!this.fromBlock) {
                this.error = true
                this.errors.fromBlock = true
            } else {
                this.errors.fromBlock = false
            }
            if (!this.toBlock) {
                this.error = true
                this.errors.toBlock = true
            } else {
                this.errors.toBlock = false
            }
            if (!this.downloadType) {
                this.error = true
                this.errors.downloadType = true
            } else {
                this.errors.downloadType = false
            }
            if (!this.errors.downloadType && !this.errors.dateRange) {
                this.error = false
            }
            if (!this.error) {
                const body = {
                    fromBlock: this.fromBlock,
                    toBlock: this.toBlock,
                    downloadType: this.downloadType,
                    timestamp: Math.floor(Date.now() / 1000)
                }
                const options = {
                    expiresIn: '5m' // 2 hours for resetting password
                }
                body.token = jwt.sign(body, process.env.JWT_SECRET, options)

                self.loadingForm = true
                const { data } = await this.$axios.post(`/api/accounts/${this.accountAddress}/download`, body)
                if (data.errors) {
                    this.errors = data.errors
                } else {
                    FileDownload(data, 'data.csv')
                }
            }
        }
    },
    head: () => ({
        title: 'Download Data'
    })
}
</script>
